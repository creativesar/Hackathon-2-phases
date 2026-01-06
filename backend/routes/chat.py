"""
T-313: Chat API endpoint for AI chatbot
T-314: Implement conversation loading
T-317: Implement stateless design

This module implements the chat API endpoint that allows users to interact with the AI agent
through natural language. The endpoint handles conversation persistence and integrates with
the OpenAI agent and MCP tools. The design is stateless - no conversation state is held
in server memory between requests. All state is loaded from and saved to the database.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select

from models import Conversation, Message
from db import get_session
from middleware.auth import verify_token
from agent import get_agent


def get_or_create_conversation(
    session: Session,
    user_id: str,
    conversation_id: Optional[int] = None
) -> Conversation:
    """
    Get existing conversation or create new one

    Args:
        session: Database session
        user_id: ID of the user
        conversation_id: Optional conversation ID to retrieve existing conversation

    Returns:
        Conversation: Retrieved or newly created conversation
    """
    if conversation_id:
        # Fetch existing conversation and verify it belongs to user
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conversation = session.exec(statement).first()

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    return conversation


def ensure_openai_thread_exists(conversation: Conversation, agent) -> str:
    """
    Ensure the OpenAI thread exists for the conversation and return the thread ID

    Args:
        conversation: The conversation object from our database
        agent: The agent instance to use for thread operations

    Returns:
        str: The OpenAI thread ID
    """
    # If conversation has a thread_id stored, verify it exists in OpenAI
    if conversation.thread_id:
        try:
            # Verify the thread exists in OpenAI
            agent.client.beta.threads.retrieve(conversation.thread_id)
            return conversation.thread_id
        except Exception:
            # If thread doesn't exist in OpenAI, create a new one
            thread = agent.client.beta.threads.create()
            # We'll update the conversation object, but the database update happens in the calling function
            conversation.thread_id = thread.id
            return thread.id
    else:
        # Create a new OpenAI thread
        thread = agent.client.beta.threads.create()
        return thread.id


def create_message(
    session: Session,
    user_id: str,
    conversation_id: int,
    role: str,
    content: str,
    tool_calls: Optional[str] = None
) -> Message:
    """
    Create a new message in the database

    Args:
        session: Database session
        user_id: ID of the user
        conversation_id: ID of the conversation
        role: Role of the message sender ("user" or "assistant")
        content: Content of the message
        tool_calls: Optional JSON string of tool calls (for assistant messages)

    Returns:
        Message: Created message object
    """
    message = Message(
        user_id=user_id,
        conversation_id=conversation_id,
        role=role,
        content=content,
        tool_calls=tool_calls
    )
    session.add(message)
    session.flush()  # Flush to get the ID but don't commit yet
    return message


# Create router
router = APIRouter(prefix="/api/{user_id}", tags=["chat"])

# Request/Response models
class ChatRequest(BaseModel):
    """
    Request model for chat endpoint
    """
    conversation_id: Optional[int] = None
    message: str


class ChatResponse(BaseModel):
    """
    Response model for chat endpoint
    """
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_results: Optional[List[Dict[str, Any]]] = None


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session),
    token_data: dict = Depends(verify_token)
):
    """
    Chat endpoint that allows users to interact with the AI agent through natural language.

    Args:
        user_id: ID of the user (from URL path)
        request: Chat request containing message and optional conversation_id
        session: Database session
        token_data: Decoded JWT token data (from authentication middleware)

    Returns:
        ChatResponse: Response from the AI agent with conversation ID
    """
    # Verify user_id in URL matches the authenticated user
    current_user_id = token_data["user_id"]
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get or create conversation using utility function
    conversation = get_or_create_conversation(
        session=session,
        user_id=user_id,
        conversation_id=request.conversation_id
    )

    # Store user message in database
    create_message(
        session=session,
        user_id=user_id,
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )

    try:
        # Get the agent instance
        agent = get_agent()

        # Ensure the OpenAI thread exists for this conversation and get the thread ID
        thread_id = ensure_openai_thread_exists(conversation, agent)

        # Call the agent to get the response using the OpenAI thread ID
        agent_response = agent.chat(request.message, thread_id=thread_id)

        # If the conversation didn't have a thread_id before, or it was invalid,
        # we might have created a new one, so update the database
        if not conversation.thread_id or conversation.thread_id != thread_id:
            conversation.thread_id = thread_id
            session.add(conversation)
            # We don't need a separate commit since we commit at the end

        # Store assistant response in database
        create_message(
            session=session,
            user_id=user_id,
            conversation_id=conversation.id,
            role="assistant",
            content=agent_response.response,
            tool_calls=str(agent_response.tool_calls) if agent_response.tool_calls else None
        )

        # Commit both messages and conversation updates to the database
        session.commit()

        return ChatResponse(
            conversation_id=conversation.id,
            response=agent_response.response,
            tool_calls=agent_response.tool_calls,
            tool_results=[]  # Tool results would be populated when we implement full tool execution cycle
        )
    except Exception as e:
        # Rollback any uncommitted changes if agent processing fails
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


# Additional endpoints for conversation management might be added later
# For now, focusing on the main chat endpoint as specified in the task