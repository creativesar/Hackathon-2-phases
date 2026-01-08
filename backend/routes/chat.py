"""
Chat API route handlers
Implements conversational interface for AI-powered task management
Phase III: AI Chatbot
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from db import get_session
from middleware.auth import verify_token
from models import Conversation, Message
from agent import run_agent
from pydantic import BaseModel


# Request/Response schemas
class ChatRequest(BaseModel):
    """Request schema for chat endpoint"""
    conversation_id: Optional[int] = None
    message: str


class ChatResponse(BaseModel):
    """Response schema for chat endpoint"""
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None


router = APIRouter(prefix="/api/{user_id}/chat", tags=["chat"])


# Conversation service functions (T-314)
async def get_or_create_conversation(
    session: AsyncSession,
    user_id: str,
    conversation_id: Optional[int] = None
) -> Conversation:
    """
    Load existing conversation or create new one.

    Args:
        session: Database session
        user_id: User identifier
        conversation_id: Optional conversation ID to load

    Returns:
        Conversation object

    Raises:
        HTTPException: If conversation not found or access denied
    """
    if conversation_id:
        # Load existing conversation
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        result = await session.execute(statement)
        conversation = result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found or access denied"
            )

        # Update timestamp
        conversation.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(conversation)

        return conversation
    else:
        # Create new conversation
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

        return conversation


async def load_conversation_history(
    session: AsyncSession,
    conversation_id: int
) -> List[Dict[str, str]]:
    """
    Load all messages from a conversation.

    Args:
        session: Database session
        conversation_id: Conversation ID

    Returns:
        List of messages in format [{"role": "user"|"assistant", "content": "..."}]
    """
    statement = select(Message).where(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc())

    result = await session.execute(statement)
    messages = result.scalars().all()

    # Convert to agent format
    return [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]


# Message service functions (T-315)
async def store_message(
    session: AsyncSession,
    user_id: str,
    conversation_id: int,
    role: str,
    content: str,
    tool_calls: Optional[List[Dict[str, Any]]] = None
) -> Message:
    """
    Store a message in the database.

    Args:
        session: Database session
        user_id: User identifier
        conversation_id: Conversation ID
        role: Message role ("user" or "assistant")
        content: Message content
        tool_calls: Optional list of tool calls made

    Returns:
        Created Message object
    """
    message = Message(
        user_id=user_id,
        conversation_id=conversation_id,
        role=role,
        content=content,
        tool_calls=json.dumps(tool_calls) if tool_calls else None
    )

    session.add(message)
    await session.commit()
    await session.refresh(message)

    return message


# Chat endpoint (T-313, T-317, T-318)
@router.post("", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)  # T-318: JWT middleware
):
    """
    Stateless chat endpoint for AI-powered task management.

    Flow (T-317: Stateless design):
    1. Load or create conversation from database
    2. Store user message in database
    3. Load conversation history from database
    4. Run agent with history + new message
    5. Store assistant response in database
    6. Return response (server holds no state)

    Args:
        user_id: User identifier from URL
        request: Chat request with optional conversation_id and message
        session: Database session
        auth: JWT authentication data

    Returns:
        Chat response with conversation_id, response text, and tool_calls

    Raises:
        403: User ID mismatch
        404: Conversation not found
        500: Agent execution error
    """
    # T-318: Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    try:
        # Step 1: Load or create conversation (T-314)
        conversation = await get_or_create_conversation(
            session,
            user_id,
            request.conversation_id
        )

        # Step 2: Store user message (T-315)
        await store_message(
            session,
            user_id,
            conversation.id,
            role="user",
            content=request.message
        )

        # Step 3: Load conversation history (T-314)
        history = await load_conversation_history(session, conversation.id)

        # Step 4: Run agent with history and user_id
        # Note: history already includes the new user message we just stored
        agent_result = await run_agent(request.message, user_id, history[:-1])  # Exclude last message since run_agent adds it

        if agent_result["error"]:
            raise HTTPException(
                status_code=500,
                detail=f"Agent execution error: {agent_result['error']}"
            )

        # Step 5: Store assistant response (T-315)
        await store_message(
            session,
            user_id,
            conversation.id,
            role="assistant",
            content=agent_result["response"],
            tool_calls=agent_result["tool_calls"]
        )

        # Step 6: Return response (T-317: Server holds no state)
        return ChatResponse(
            conversation_id=conversation.id,
            response=agent_result["response"],
            tool_calls=agent_result["tool_calls"]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
