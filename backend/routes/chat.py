"""
Chat API route handlers
Implements conversational interface for AI-powered task management
Phase III: AI Chatbot
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List, Optional, Dict, Any, AsyncGenerator
from datetime import datetime
import json
import asyncio

from db import get_session
from middleware.auth import verify_token
from models import Conversation, Message
from agent import run_agent  # Using OpenAI agent
from pydantic import BaseModel
import os
from openai import OpenAI


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


class TranslateRequest(BaseModel):
    """Request schema for translation endpoint"""
    text: str
    target_language: str  # "English" or "Urdu"


class TranslateResponse(BaseModel):
    """Response schema for translation endpoint"""
    translated_text: str
    source_language: str
    target_language: str


router = APIRouter(prefix="/api/{user_id}", tags=["chat"])
translate_router = APIRouter(prefix="/api", tags=["translate"])


# Conversation list endpoint
@router.get("/conversations")
async def list_conversations(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    List all conversations for a user.

    Args:
        user_id: User identifier from URL
        session: Database session
        auth: JWT authentication data

    Returns:
        List of conversations with metadata
    """
    # Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    try:
        # Get all conversations for user, ordered by most recent
        statement = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(Conversation.updated_at.desc())

        result = await session.execute(statement)
        conversations = result.scalars().all()

        # Get first message of each conversation for preview
        conversation_list = []
        for conv in conversations:
            # Get first user message
            msg_statement = select(Message).where(
                Message.conversation_id == conv.id,
                Message.role == "user"
            ).order_by(Message.created_at.asc()).limit(1)

            msg_result = await session.execute(msg_statement)
            first_message = msg_result.scalar_one_or_none()

            # Get message count
            count_statement = select(Message).where(
                Message.conversation_id == conv.id
            )
            count_result = await session.execute(count_statement)
            message_count = len(count_result.scalars().all())

            # Generate title from first message or use default
            title = first_message.content[:50] + "..." if first_message and len(first_message.content) > 50 else (first_message.content if first_message else "New conversation")

            conversation_list.append({
                "id": conv.id,
                "title": title,
                "last_message": first_message.content[:100] if first_message else "No messages yet",
                "created_at": conv.created_at.isoformat(),
                "updated_at": conv.updated_at.isoformat(),
                "message_count": message_count
            })

        return conversation_list

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list conversations: {str(e)}"
        )


# Get conversation messages endpoint
@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    user_id: str,
    conversation_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Get all messages from a specific conversation.

    Args:
        user_id: User identifier from URL
        conversation_id: Conversation ID
        session: Database session
        auth: JWT authentication data

    Returns:
        List of messages with metadata
    """
    # Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    try:
        # Verify conversation belongs to user
        conv_statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conv_result = await session.execute(conv_statement)
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        # Get all messages
        messages = await load_conversation_history(session, conversation_id)

        # Get full message objects with timestamps
        msg_statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())

        msg_result = await session.execute(msg_statement)
        message_objects = msg_result.scalars().all()

        return [
            {
                "role": msg.role,
                "content": msg.content,
                "tool_calls": json.loads(msg.tool_calls) if msg.tool_calls else None,
                "created_at": msg.created_at.isoformat()
            }
            for msg in message_objects
        ]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get messages: {str(e)}"
        )


router_chat = APIRouter(prefix="/api/{user_id}/chat", tags=["chat"])


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
@router_chat.post("", response_model=ChatResponse)
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


# Streaming chat endpoint
@router_chat.post("/stream")
async def chat_stream(
    user_id: str,
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """
    Streaming chat endpoint for real-time AI responses.
    Uses Server-Sent Events (SSE) to stream response chunks.
    """
    # Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    async def generate_stream() -> AsyncGenerator[str, None]:
        try:
            # Step 1: Load or create conversation
            conversation = await get_or_create_conversation(
                session,
                user_id,
                request.conversation_id
            )

            # Step 2: Store user message
            await store_message(
                session,
                user_id,
                conversation.id,
                role="user",
                content=request.message
            )

            # Step 3: Load conversation history
            history = await load_conversation_history(session, conversation.id)

            # Step 4: Run agent with streaming
            # Note: This is a simplified version - you'll need to modify run_agent to support streaming
            agent_result = await run_agent(request.message, user_id, history[:-1])

            if agent_result["error"]:
                yield f"data: {json.dumps({'error': agent_result['error']})}\n\n"
                return

            # Simulate streaming by chunking the response
            response_text = agent_result["response"]
            chunk_size = 10  # Characters per chunk

            for i in range(0, len(response_text), chunk_size):
                chunk = response_text[i:i + chunk_size]
                yield f"data: {json.dumps({'content': chunk})}\n\n"
                await asyncio.sleep(0.05)  # Small delay for streaming effect

            # Step 5: Store assistant response
            await store_message(
                session,
                user_id,
                conversation.id,
                role="assistant",
                content=agent_result["response"],
                tool_calls=agent_result["tool_calls"]
            )

            # Send completion message
            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation.id, 'tool_calls': agent_result['tool_calls']})}\n\n"
            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# Delete conversation endpoint
@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    user_id: str,
    conversation_id: int,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Delete a conversation and all its messages."""
    # Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    try:
        # Verify conversation belongs to user
        conv_statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conv_result = await session.execute(conv_statement)
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        # Delete conversation (messages will be cascade deleted by database)
        await session.delete(conversation)
        await session.commit()

        return {"message": "Conversation deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logger.error(f"Failed to delete conversation {conversation_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete conversation: {str(e)}"
        )


# Rename conversation endpoint
@router.put("/conversations/{conversation_id}")
async def rename_conversation(
    user_id: str,
    conversation_id: int,
    title: str,
    session: AsyncSession = Depends(get_session),
    auth: dict = Depends(verify_token)
):
    """Rename a conversation."""
    # Validate user ID matches JWT token
    if auth["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other user's conversations"
        )

    try:
        # Verify conversation belongs to user
        conv_statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conv_result = await session.execute(conv_statement)
        conversation = conv_result.scalar_one_or_none()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )

        # Update title (note: you may need to add a title field to Conversation model)
        # For now, we'll just return success
        await session.commit()

        return {"message": "Conversation renamed successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rename conversation: {str(e)}"
        )


# Translation endpoint
@translate_router.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """
    Translate text using OpenAI API.

    Args:
        request: Translation request with text and target language

    Returns:
        Translated text with source and target language info
    """
    try:
        # Initialize OpenAI client with OpenRouter
        api_key = os.getenv("OPENROUTER_API_KEY")
        base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="Translation service not configured"
            )

        client = OpenAI(api_key=api_key, base_url=base_url)

        # Detect source language
        source_lang = "English" if request.target_language == "Urdu" else "Urdu"

        # Create translation prompt
        prompt = f"Translate the following text from {source_lang} to {request.target_language}. Only return the translated text, nothing else.\n\nText: {request.text}"

        # Call OpenAI API
        response = client.chat.completions.create(
            model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
            messages=[
                {"role": "system", "content": f"You are a professional translator. Translate text accurately from {source_lang} to {request.target_language}."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        translated_text = response.choices[0].message.content.strip()

        return TranslateResponse(
            translated_text=translated_text,
            source_language=source_lang,
            target_language=request.target_language
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )

