"""
T-305: Official MCP Server Foundation for Todo App

This module implements the Model Context Protocol (MCP) server foundation for the Todo application.
The MCP server exposes tools that can be used by AI agents to perform todo operations.
"""

from mcp.server import Server
from mcp.types import Tool
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import asyncio
from datetime import datetime

# Delayed imports to avoid database connection issues at module load
# Database imports will be handled within functions when needed


class AddTaskArguments(BaseModel):
    """Arguments for add_task tool"""
    user_id: str = Field(..., description="User ID who owns this task")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Optional task description")


class ListTasksArguments(BaseModel):
    """Arguments for list_tasks tool"""
    user_id: str = Field(..., description="User ID")
    status: Optional[str] = Field("all", description="Filter by status: all, pending, completed")


class CompleteTaskArguments(BaseModel):
    """Arguments for complete_task tool"""
    user_id: str = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID to complete")


class DeleteTaskArguments(BaseModel):
    """Arguments for delete_task tool"""
    user_id: str = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID to delete")


class UpdateTaskArguments(BaseModel):
    """Arguments for update_task tool"""
    user_id: str = Field(..., description="User ID")
    task_id: int = Field(..., description="Task ID")
    title: Optional[str] = Field(None, description="New title")
    description: Optional[str] = Field(None, description="New description")


# Initialize the MCP server
mcp_server = Server("todo-mcp-server")


async def add_task_tool(user_id: str, title: str, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new task for the user.

    Args:
        user_id: ID of the user who owns the task
        title: Title of the task
        description: Optional description of the task

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate title
        if not title or len(title) < 1 or len(title) > 200:
            raise ValueError("Title must be 1-200 characters")

        if description and len(description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")

        # Create task in database
        task = Task(
            user_id=user_id,
            title=title,
            description=description
        )

        session.add(task)
        session.commit()
        session.refresh(task)
        session.close()

        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title
        }
    except Exception as e:
        # Error handling wrapper
        print(f"Error in add_task: {str(e)}")
        raise e


async def list_tasks_tool(user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """
    List tasks for the user.

    Args:
        user_id: ID of the user
        status: Filter by status ('all', 'pending', 'completed')

    Returns:
        List of task dictionaries
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate status
        if status not in ["all", "pending", "completed"]:
            raise ValueError("Invalid status. Use 'all', 'pending', or 'completed'")

        # Query tasks
        query = select(Task).where(Task.user_id == user_id)

        if status == "completed":
            query = query.where(Task.completed == True)
        elif status == "pending":
            query = query.where(Task.completed == False)

        tasks = session.exec(query).all()
        session.close()

        # Format results
        result = []
        for task in tasks:
            result.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "created_at": task.created_at.isoformat()
            })

        return result
    except Exception as e:
        # Error handling wrapper
        print(f"Error in list_tasks: {str(e)}")
        raise e


async def complete_task_tool(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as complete.

    Args:
        user_id: ID of the user
        task_id: ID of the task to complete

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate task exists and belongs to user
        task = session.get(Task, task_id)
        if not task:
            raise ValueError("Task not found")
        if task.user_id != user_id:
            raise ValueError("Access denied")

        # Toggle completion
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)
        session.close()

        return {
            "task_id": task.id,
            "status": "completed" if task.completed else "pending",
            "title": task.title
        }
    except Exception as e:
        # Error handling wrapper
        print(f"Error in complete_task: {str(e)}")
        raise e


async def delete_task_tool(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task.

    Args:
        user_id: ID of the user
        task_id: ID of the task to delete

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate task exists and belongs to user
        task = session.get(Task, task_id)
        if not task:
            raise ValueError("Task not found")
        if task.user_id != user_id:
            raise ValueError("Access denied")

        # Delete task
        title = task.title
        session.delete(task)
        session.commit()
        session.close()

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title
        }
    except Exception as e:
        # Error handling wrapper
        print(f"Error in delete_task: {str(e)}")
        raise e


async def update_task_tool(user_id: str, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Update a task.

    Args:
        user_id: ID of the user
        task_id: ID of the task to update
        title: New title (optional)
        description: New description (optional)

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate task exists and belongs to user
        task = session.get(Task, task_id)
        if not task:
            raise ValueError("Task not found")
        if task.user_id != user_id:
            raise ValueError("Access denied")

        # Update fields
        if title:
            if len(title) < 1 or len(title) > 200:
                raise ValueError("Title must be 1-200 characters")
            task.title = title

        if description:
            if len(description) > 1000:
                raise ValueError("Description cannot exceed 1000 characters")
            task.description = description

        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)
        session.close()

        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title
        }
    except Exception as e:
        # Error handling wrapper
        print(f"Error in update_task: {str(e)}")
        raise e


# Documentation for API usage
"""
Example usage and API documentation:

1. Basic usage:
   ```python
   from mcp_server import get_mcp_server

   server = get_mcp_server()
   # The server can then be run using the appropriate MCP run method
   ```

2. Available tools:
   - add_task: Creates a new task for a user
   - list_tasks: Retrieves tasks for a user with optional status filter
   - complete_task: Marks a task as complete
   - delete_task: Removes a task
   - update_task: Updates task title or description

3. Environment variables needed:
   - MCP server configuration as needed by the framework
"""

def get_mcp_server():
    """
    Get the configured MCP server instance

    Returns:
        Server: The configured MCP server
    """
    return mcp_server


def get_mcp_tools():
    """
    Get list of all MCP tools in Agent format for integration with OpenAI Agent

    Returns:
        List of all MCP tools in the format expected by the OpenAI Agent
    """
    # Return the tools in the format expected by the agent
    # This function returns the tool functions themselves for the agent to use
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "User ID who owns this task"},
                        "title": {"type": "string", "description": "Task title"},
                        "description": {"type": "string", "description": "Optional task description"}
                    },
                    "required": ["user_id", "title"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "List tasks for the user with optional status filter",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "User ID"},
                        "status": {"type": "string", "description": "Filter by status: all, pending, completed", "enum": ["all", "pending", "completed"]}
                    },
                    "required": ["user_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "complete_task",
                "description": "Mark a task as complete",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "User ID"},
                        "task_id": {"type": "integer", "description": "Task ID to complete"}
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Delete a task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "User ID"},
                        "task_id": {"type": "integer", "description": "Task ID to delete"}
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update a task title or description",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "string", "description": "User ID"},
                        "task_id": {"type": "integer", "description": "Task ID to update"},
                        "title": {"type": "string", "description": "New title (optional)"},
                        "description": {"type": "string", "description": "New description (optional)"}
                    },
                    "required": ["user_id", "task_id"]
                }
            }
        }
    ]


# Note: The actual tool registration may vary depending on the specific MCP implementation.
# The add_task tool function is implemented and ready for registration with the MCP server.
# Registration method depends on the specific MCP framework being used.


# Example usage (for testing purposes)
if __name__ == "__main__":
    print("MCP Server module loaded successfully")
    print("This module provides the foundation for MCP tools but requires proper MCP framework integration")