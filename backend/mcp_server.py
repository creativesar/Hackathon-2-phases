"""
MCP Server Implementation
Phase III: AI Chatbot - MCP Tools for Task Management

This module implements the MCP server with 5 tools:
- add_task: Create a new task
- list_tasks: Retrieve tasks from user's list
- complete_task: Mark a task as complete
- delete_task: Remove a task from the list
- update_task: Modify task title or description
"""

from typing import Optional, List, Dict, Any
from mcp.server import Server
from mcp.types import Tool, TextContent
import json
from sqlmodel.ext.asyncio.session import AsyncSession

# Import database and service functions
from db import get_session, engine
from services import task_service

# Initialize MCP server
mcp_server = Server("todo-server")


def get_mcp_tools() -> List[Tool]:
    """
    Returns the list of all MCP tools available to the agent.

    Returns:
        List of Tool objects that can be used by OpenAI Agents SDK
    """
    tools = [
        Tool(
            name="add_task",
            description="Create a new task for the user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID who owns the task"
                    },
                    "title": {
                        "type": "string",
                        "description": "Task title (1-200 characters)"
                    },
                    "description": {
                        "type": "string",
                        "description": "Optional task description (0-1000 characters)"
                    }
                },
                "required": ["user_id", "title"]
            }
        ),
        Tool(
            name="list_tasks",
            description="Retrieve tasks from the user's list",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID whose tasks to retrieve"
                    },
                    "status": {
                        "type": "string",
                        "enum": ["all", "pending", "completed"],
                        "description": "Filter tasks by status (default: all)"
                    }
                },
                "required": ["user_id"]
            }
        ),
        Tool(
            name="complete_task",
            description="Mark a task as complete or toggle completion status",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID who owns the task"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "The ID of the task to complete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        ),
        Tool(
            name="delete_task",
            description="Remove a task from the list",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID who owns the task"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "The ID of the task to delete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        ),
        Tool(
            name="update_task",
            description="Modify task title or description",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The user ID who owns the task"
                    },
                    "task_id": {
                        "type": "integer",
                        "description": "The ID of the task to update"
                    },
                    "title": {
                        "type": "string",
                        "description": "New task title (1-200 characters)"
                    },
                    "description": {
                        "type": "string",
                        "description": "New task description (0-1000 characters)"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        )
    ]
    return tools


# MCP Tool Implementations (T-306 to T-310)

async def add_task(user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        user_id: The user ID who owns the task
        title: Task title (1-200 characters)
        description: Optional task description (0-1000 characters)

    Returns:
        Dict with task_id, status, and title

    Raises:
        ValueError: If validation fails
    """
    # Validate title
    if not title or len(title) < 1 or len(title) > 200:
        raise ValueError("Title must be 1-200 characters")

    # Validate description
    if description and len(description) > 1000:
        raise ValueError("Description cannot exceed 1000 characters")

    # Create task in database
    async with AsyncSession(engine) as session:
        task = await task_service.create_task(session, user_id, title, description)

        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title
        }


async def list_tasks(user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """
    Retrieve tasks from the user's list.

    Args:
        user_id: The user ID whose tasks to retrieve
        status: Filter by status ("all", "pending", "completed")

    Returns:
        List of task dictionaries

    Raises:
        ValueError: If status is invalid
    """
    # Validate status
    if status not in ["all", "pending", "completed"]:
        raise ValueError("Invalid status. Use 'all', 'pending', or 'completed'")

    # Query tasks
    async with AsyncSession(engine) as session:
        tasks = await task_service.list_tasks(session, user_id)

        # Filter by status
        if status == "pending":
            tasks = [t for t in tasks if not t.completed]
        elif status == "completed":
            tasks = [t for t in tasks if t.completed]

        # Convert to dict format
        return [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat()
            }
            for task in tasks
        ]


async def complete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as complete or toggle completion status.

    Args:
        user_id: The user ID who owns the task
        task_id: The ID of the task to complete

    Returns:
        Dict with task_id, status, and title

    Raises:
        ValueError: If task not found or access denied
    """
    async with AsyncSession(engine) as session:
        task = await task_service.toggle_completion(session, task_id, user_id)

        if not task:
            raise ValueError("Task not found or access denied")

        return {
            "task_id": task.id,
            "status": "completed" if task.completed else "pending",
            "title": task.title
        }


async def delete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Remove a task from the list.

    Args:
        user_id: The user ID who owns the task
        task_id: The ID of the task to delete

    Returns:
        Dict with task_id, status, and title

    Raises:
        ValueError: If task not found or access denied
    """
    async with AsyncSession(engine) as session:
        # Get task first to return its title
        task = await task_service.get_task(session, task_id, user_id)

        if not task:
            raise ValueError("Task not found or access denied")

        title = task.title

        # Delete task
        deleted = await task_service.delete_task(session, task_id, user_id)

        if not deleted:
            raise ValueError("Failed to delete task")

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title
        }


async def update_task(
    user_id: str,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Modify task title or description.

    Args:
        user_id: The user ID who owns the task
        task_id: The ID of the task to update
        title: New task title (1-200 characters)
        description: New task description (0-1000 characters)

    Returns:
        Dict with task_id, status, and title

    Raises:
        ValueError: If validation fails or task not found
    """
    # Validate title if provided
    if title and (len(title) < 1 or len(title) > 200):
        raise ValueError("Title must be 1-200 characters")

    # Validate description if provided
    if description and len(description) > 1000:
        raise ValueError("Description cannot exceed 1000 characters")

    async with AsyncSession(engine) as session:
        # Get existing task
        task = await task_service.get_task(session, task_id, user_id)

        if not task:
            raise ValueError("Task not found or access denied")

        # Use existing values if not provided
        new_title = title if title else task.title
        new_description = description if description is not None else task.description

        # Update task
        updated_task = await task_service.update_task(
            session, task_id, user_id, new_title, new_description
        )

        if not updated_task:
            raise ValueError("Failed to update task")

        return {
            "task_id": updated_task.id,
            "status": "updated",
            "title": updated_task.title
        }


# Verify imports work correctly
if __name__ == "__main__":
    print("[OK] MCP SDK imported successfully")
    print(f"[OK] MCP server '{mcp_server.name}' initialized")
    tools = get_mcp_tools()
    print(f"[OK] {len(tools)} MCP tools defined:")
    for tool in tools:
        print(f"     - {tool.name}: {tool.description}")
    print("\n[OK] All 5 MCP tool implementations completed:")
    print("     - add_task: Create new tasks")
    print("     - list_tasks: Retrieve tasks with filtering")
    print("     - complete_task: Toggle task completion")
    print("     - delete_task: Remove tasks")
    print("     - update_task: Modify task details")
    print("\nMCP server is ready for integration with OpenAI Agents SDK.")
