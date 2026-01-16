"""
OpenAI Agents SDK Integration with OpenRouter Support
Phase III: AI Chatbot - Agent Definition and Runner

This module defines the TodoBot agent using OpenAI Agents SDK.
The agent helps users manage their tasks through natural language.
Supports both OpenAI and OpenRouter APIs.
"""

from typing import List, Dict, Any, Optional
from agents import Agent, Runner, function_tool
import os

# Import MCP tool implementations
from mcp_server import (
    add_task as mcp_add_task,
    list_tasks as mcp_list_tasks,
    complete_task as mcp_complete_task,
    delete_task as mcp_delete_task,
    update_task as mcp_update_task
)

# Configure OpenAI SDK environment variables for OpenRouter support
# The Agents SDK will automatically use these environment variables
def configure_openai_environment():
    """
    Configure OpenAI SDK environment variables.
    Supports both OpenAI and OpenRouter APIs.

    If OPENROUTER_API_KEY is set, configures the SDK to use OpenRouter.
    Otherwise, uses standard OpenAI configuration.
    """
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openrouter_base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

    if openrouter_key:
        # Configure for OpenRouter
        os.environ["OPENAI_API_KEY"] = openrouter_key
        os.environ["OPENAI_BASE_URL"] = openrouter_base_url

        # Set max_tokens to stay within OpenRouter free tier (4000 tokens max)
        # This environment variable is read by the OpenAI SDK
        max_tokens = os.getenv("MAX_TOKENS", "1000")
        os.environ["OPENAI_MAX_COMPLETION_TOKENS"] = max_tokens
    else:
        # Use standard OpenAI configuration
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            raise ValueError("Either OPENROUTER_API_KEY or OPENAI_API_KEY must be set")

# Configure environment before creating agent
configure_openai_environment()


# Global variable to store current user_id context
_current_user_id: Optional[str] = None

def set_user_context(user_id: str):
    """Set the current user context for tool execution."""
    global _current_user_id
    _current_user_id = user_id

def get_user_context() -> str:
    """Get the current user context."""
    global _current_user_id
    if _current_user_id is None:
        raise ValueError("User context not set")
    return _current_user_id


# Define function tools using @function_tool decorator
# These tools do NOT require user_id - it's automatically injected from context
@function_tool
async def add_task(title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        title: Task title (1-200 characters)
        description: Optional task description (0-1000 characters)

    Returns:
        Dictionary with task_id, status, and title
    """
    user_id = get_user_context()
    return await mcp_add_task(user_id, title, description)


@function_tool
async def list_tasks(status: str = "all") -> List[Dict[str, Any]]:
    """
    Retrieve tasks from the user's list.

    Args:
        status: Filter by status ("all", "pending", "completed")

    Returns:
        List of task dictionaries
    """
    user_id = get_user_context()
    return await mcp_list_tasks(user_id, status)


@function_tool
async def complete_task(task_id: int) -> Dict[str, Any]:
    """
    Mark a task as complete or toggle completion status.

    Args:
        task_id: The ID of the task to complete

    Returns:
        Dictionary with task_id, status, and title
    """
    user_id = get_user_context()
    return await mcp_complete_task(user_id, task_id)


@function_tool
async def delete_task(task_id: int) -> Dict[str, Any]:
    """
    Remove a task from the list.

    Args:
        task_id: The ID of the task to delete

    Returns:
        Dictionary with task_id, status, and title
    """
    user_id = get_user_context()
    return await mcp_delete_task(user_id, task_id)


@function_tool
async def update_task(
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Modify task title or description.

    Args:
        task_id: The ID of the task to update
        title: New task title (1-200 characters)
        description: New task description (0-1000 characters)

    Returns:
        Dictionary with task_id, status, and title
    """
    user_id = get_user_context()
    return await mcp_update_task(user_id, task_id, title, description)


def get_agent_instructions() -> str:
    """
    Returns the agent's instruction set.

    The agent is designed to:
    - Understand natural language task management commands
    - Use MCP tools to perform CRUD operations on tasks
    - Provide friendly, helpful responses
    - Handle errors gracefully
    - Always include task IDs in responses
    """
    return """You are TaskFlowBot, a helpful task management assistant. You help users manage their tasks through natural language.

IMPORTANT: You do NOT need to ask for or provide user_id. The system automatically handles user authentication.

Use the available tools to perform actions:
- When user wants to add/remember something, use add_task tool with just title and description
- When user asks to see/show/list tasks, use list_tasks tool (optionally with status filter)
- When user says done/complete/finished, use complete_task tool with the task_id
- When user says delete/remove/cancel, use delete_task tool with the task_id
- When user says change/update/rename, use update_task tool with task_id and new values

CRITICAL - Always include task IDs in your responses:
- When adding a task, say "I've added Task #[ID]: [title]"
- When listing tasks, format each as "Task #[ID]: [title]"
- When completing/deleting/updating, say "Task #[ID] has been [action]"
- Remind users they can reference tasks by ID (e.g., "To delete it, say 'delete task 5'")

Always confirm actions with a friendly response that includes the task ID.
Handle errors gracefully and help user rephrase if needed.
Be concise but helpful in your responses."""


# Get model name from environment or use default
MODEL_NAME = os.getenv("AI_MODEL", "gpt-4o")  # OpenRouter supports gpt-4o

# Get max tokens from environment or use default (reduced for OpenRouter credit limits)
# OpenRouter free tier allows up to 4000 tokens
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1000"))  # Reduced to stay within free tier

# Create the TodoBot agent with all tools (T-311)
# OpenRouter support configured via environment variables above
# Token limits are controlled via OPENAI_MAX_COMPLETION_TOKENS environment variable
todobot_agent = Agent(
    name="TodoBot",
    instructions=get_agent_instructions(),
    model=MODEL_NAME,
    tools=[add_task, list_tasks, complete_task, delete_task, update_task]
)


# Agent Runner implementation (T-312)
async def run_agent(user_message: str, user_id: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Run the TodoBot agent with a user message and optional conversation history.

    Args:
        user_message: The user's input message
        user_id: The authenticated user's ID (automatically injected into tool calls via context)
        conversation_history: Optional list of previous messages in format [{"role": "user"|"assistant", "content": "..."}]

    Returns:
        Dictionary containing:
        - response: The agent's text response
        - tool_calls: List of tool calls made (if any)
        - error: Error message if execution failed

    Example:
        result = await run_agent("Add a task to buy groceries", "user123")
        print(result["response"])
    """
    try:
        # Set user context for tool execution
        set_user_context(user_id)

        # Build messages array
        messages = conversation_history or []
        messages.append({"role": "user", "content": user_message})

        # Run the agent
        # Note: OpenAI Agents SDK doesn't support max_tokens parameter in Runner.run()
        # Token limits are controlled by the model configuration
        result = await Runner.run(
            todobot_agent,
            messages
        )

        # Extract response and tool calls
        return {
            "response": result.final_output,
            "tool_calls": getattr(result, "tool_calls", []),
            "error": None
        }

    except Exception as e:
        return {
            "response": f"I encountered an error: {str(e)}",
            "tool_calls": [],
            "error": str(e)
        }


# Verify imports work correctly
if __name__ == "__main__":
    print("[OK] OpenAI Agents SDK imported successfully")

    # Check which API is being used
    if os.getenv("OPENROUTER_API_KEY"):
        print("[OK] Using OpenRouter API")
        print(f"[OK] Base URL: {os.getenv('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')}")
    else:
        print("[OK] Using OpenAI API")

    print(f"[OK] Agent '{todobot_agent.name}' created with {len(todobot_agent.tools)} tools")
    print(f"[OK] Agent model: {todobot_agent.model}")
    print(f"[OK] Agent instructions: {len(get_agent_instructions())} characters")
    print("\n[OK] Function tools registered:")
    for tool in todobot_agent.tools:
        print(f"     - {tool.name}")
    print("\n[OK] Agent Runner implemented")
    print("\nTodoBot agent is ready for chat API integration.")
