---
name: mcp-tools
description: MCP (Model Context Protocol) tools for Todo App. Use when creating, listing, completing, deleting, or updating tasks via AI agent. These are stateless tools that interact with database. Includes: (1) add_task, (2) list_tasks, (3) complete_task, (4) delete_task, (5) update_task
---

# MCP Tools for Todo App

## Architecture

```
┌─────────────────┐     ┌─────────────────────────────────────┐
│  OpenAI Agent │────▶│         MCP Tools Layer          │
│  (Frontend)   │     │  add_task, list_tasks, etc.    │
└─────────────────┘     │  ┌─────────────────────────────┐  │
                        │  │   Database Operations       │  │
                        │  │   (Stateless)             │  │
                        │  └─────────────────────────────┘  │
                        └─────────────────────────────────────┘
```

## Tool Design Principles

### Stateless
- Every tool call opens fresh DB connection
- No in-memory state between calls
- All state in database (Neon PostgreSQL)

### User Isolation
- Every tool requires `user_id` parameter
- Never return tasks from other users
- User ID comes from JWT token in agent

### Error Handling
- Return errors as JSON with `error` key
- Agent can parse and inform user
- Never expose database internals

## Tool Definitions

### Tool: add_task

**Purpose:** Create a new task for a user.

**Parameters:**
- `user_id` (string, required): User ID from JWT token
- `title` (string, required): Task title (1-200 characters)
- `description` (string, optional): Task description (max 1000 chars)

**Returns:**
```json
{
  "task_id": 5,
  "status": "created",
  "title": "Buy groceries"
}
```

**Example:**
```json
{
  "user_id": "ziakhan",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

### Tool: list_tasks

**Purpose:** Retrieve tasks for a user with optional filtering.

**Parameters:**
- `user_id` (string, required): User ID from JWT token
- `status` (string, optional): Filter by status
  - `"all"` - Return all tasks (default)
  - `"pending"` - Return incomplete tasks only
  - `"completed"` - Return completed tasks only

**Returns:**
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-03T10:30:00Z"
  },
  ...
]
```

**Example:**
```json
{
  "user_id": "ziakhan",
  "status": "pending"
}
```

### Tool: complete_task

**Purpose:** Mark a task as complete.

**Parameters:**
- `user_id` (string, required): User ID from JWT token
- `task_id` (integer, required): ID of task to complete

**Returns:**
```json
{
  "task_id": 3,
  "status": "completed",
  "title": "Call mom"
}
```

**Example:**
```json
{
  "user_id": "ziakhan",
  "task_id": 3
}
```

### Tool: delete_task

**Purpose:** Remove a task from the list.

**Parameters:**
- `user_id` (string, required): User ID from JWT token
- `task_id` (integer, required): ID of task to delete

**Returns:**
```json
{
  "task_id": 2,
  "status": "deleted",
  "title": "Old task"
}
```

**Example:**
```json
{
  "user_id": "ziakhan",
  "task_id": 2
}
```

### Tool: update_task

**Purpose:** Modify a task title or description.

**Parameters:**
- `user_id` (string, required): User ID from JWT token
- `task_id` (integer, required): ID of task to update
- `title` (string, optional): New title (1-200 characters)
- `description` (string, optional): New description (max 1000 chars)

**Returns:**
```json
{
  "task_id": 1,
  "status": "updated",
  "title": "Buy groceries and fruits"
}
```

**Example:**
```json
{
  "user_id": "ziakhan",
  "task_id": 1,
  "title": "Buy groceries and fruits"
}
```

## Implementation

### Tool Registry

```python
# mcp_tools/__init__.py
from typing import Dict, Any
from .task_tools import (
    add_task,
    list_tasks,
    complete_task,
    delete_task,
    update_task
)

# MCP Tool Definitions
MCP_TOOLS = {
    "add_task": {
        "name": "add_task",
        "description": "Create a new todo task",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID who owns this task"
                },
                "title": {
                    "type": "string",
                    "description": "Task title"
                },
                "description": {
                    "type": "string",
                    "description": "Optional task description"
                }
            },
            "required": ["user_id", "title"]
        },
        "function": add_task
    },
    "list_tasks": {
        "name": "list_tasks",
        "description": "List all tasks for a user",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID"
                },
                "status": {
                    "type": "string",
                    "enum": ["all", "pending", "completed"],
                    "description": "Filter by task status"
                }
            },
            "required": ["user_id"]
        },
        "function": list_tasks
    },
    "complete_task": {
        "name": "complete_task",
        "description": "Mark a task as complete",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID"
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task ID to complete"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "function": complete_task
    },
    "delete_task": {
        "name": "delete_task",
        "description": "Delete a task",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID"
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task ID to delete"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "function": delete_task
    },
    "update_task": {
        "name": "update_task",
        "description": "Update a task title or description",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "User ID"
                },
                "task_id": {
                    "type": "integer",
                    "description": "Task ID"
                },
                "title": {
                    "type": "string",
                    "description": "New title"
                },
                "description": {
                    "type": "string",
                    "description": "New description"
                }
            },
            "required": ["user_id", "task_id"]
        },
        "function": update_task
    }
}

def get_tool(name: str):
    """Get tool by name."""
    return MCP_TOOLS.get(name)

def list_tools():
    """List all available tools."""
    return list(MCP_TOOLS.keys())
```

### Tool Implementation

```python
# mcp_tools/task_tools.py
from sqlmodel import Session, select
from typing import Dict
from ..models import Task
from ..db import get_session
from datetime import datetime

async def add_task(user_id: str, title: str, description: str = None) -> Dict:
    """Create a new task."""
    session = next(get_session())

    try:
        task = Task(
            user_id=user_id,
            title=title,
            description=description
        )
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title
        }
    except Exception as e:
        session.rollback()
        return {"error": f"Failed to create task: {str(e)}"}
    finally:
        session.close()

async def list_tasks(user_id: str, status: str = "all") -> Dict:
    """List all tasks for a user."""
    session = next(get_session())

    try:
        query = select(Task).where(Task.user_id == user_id)

        if status == "completed":
            query = query.where(Task.completed == True)
        elif status == "pending":
            query = query.where(Task.completed == False)

        tasks = session.exec(query).all()

        return [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
                "created_at": t.created_at.isoformat()
            }
            for t in tasks
        ]
    except Exception as e:
        return {"error": f"Failed to list tasks: {str(e)}"}
    finally:
        session.close()

async def complete_task(user_id: str, task_id: int) -> Dict:
    """Mark a task as complete."""
    session = next(get_session())

    try:
        task = session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {"error": "Task not found"}

        task.completed = True
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "task_id": task.id,
            "status": "completed",
            "title": task.title
        }
    except Exception as e:
        session.rollback()
        return {"error": f"Failed to complete task: {str(e)}"}
    finally:
        session.close()

async def delete_task(user_id: str, task_id: int) -> Dict:
    """Delete a task."""
    session = next(get_session())

    try:
        task = session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {"error": "Task not found"}

        title = task.title
        session.delete(task)
        session.commit()

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title
        }
    except Exception as e:
        session.rollback()
        return {"error": f"Failed to delete task: {str(e)}"}
    finally:
        session.close()

async def update_task(
    user_id: str,
    task_id: int,
    title: str = None,
    description: str = None
) -> Dict:
    """Update a task."""
    session = next(get_session())

    try:
        task = session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {"error": "Task not found"}

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title
        }
    except Exception as e:
        session.rollback()
        return {"error": f"Failed to update task: {str(e)}"}
    finally:
        session.close()
```

## Tool Execution Pattern

### Agent Calls Tool

```python
async def execute_tool(tool_name: str, args: dict) -> Any:
    """Execute MCP tool by name."""
    tool = get_tool(tool_name)

    if not tool:
        return {"error": f"Tool '{tool_name}' not found"}

    try:
        # Call the tool function
        result = await tool["function"](**args)
        return result
    except Exception as e:
        return {"error": f"Tool execution failed: {str(e)}"}
```

### Error Response Format

```json
{
  "error": "Task not found"
}
```

### Success Response Format

```json
{
  "task_id": 5,
  "status": "created",
  "title": "Buy groceries"
}
```

## Testing MCP Tools

### Unit Tests

```python
# tests/test_mcp_tools.py
import pytest
from mcp_tools.task_tools import add_task, list_tasks, complete_task

@pytest.mark.asyncio
async def test_add_task():
    result = await add_task(
        user_id="test-user",
        title="Test task",
        description="Test description"
    )

    assert "error" not in result
    assert result["status"] == "created"
    assert "task_id" in result

@pytest.mark.asyncio
async def test_list_tasks():
    result = await list_tasks(user_id="test-user", status="all")

    assert isinstance(result, list)
    assert len(result) >= 0

@pytest.mark.asyncio
async def test_complete_task():
    # First create a task
    created = await add_task(user_id="test-user", title="Complete me")

    # Then complete it
    result = await complete_task(user_id="test-user", task_id=created["task_id"])

    assert "error" not in result
    assert result["status"] == "completed"
```

## Quick Reference

| Tool | Purpose | Required Params |
|------|---------|----------------|
| `add_task` | Create task | `user_id`, `title` |
| `list_tasks` | List tasks | `user_id`, `status` (optional) |
| `complete_task` | Mark complete | `user_id`, `task_id` |
| `delete_task` | Delete task | `user_id`, `task_id` |
| `update_task` | Update task | `user_id`, `task_id` |

## Best Practices

1. **Always validate `user_id`** - Never return other users' data
2. **Close DB connections** - Use `finally:` blocks
3. **Rollback on errors** - Prevent partial updates
4. **Return consistent JSON** - Either success or error, never both
5. **Include timestamps** - Use ISO format (`isoformat()`)
6. **Validate input** - Check title length, required fields
7. **Log tool calls** - For debugging and analytics
8. **Handle edge cases** - Task not found, user mismatch
9. **Use transactions** - Commit or rollback atomically
10. **Keep tools stateless** - No memory between calls

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| Task not found | Wrong task_id or user mismatch | Return `{"error": "Task not found"}` |
| DB connection error | Pool exhausted | Check connection pool size |
| Duplicate tasks | Race condition | Add unique constraint on title+user_id |
| Slow tool execution | Missing indexes | Add index on user_id, completed |
| Memory leak | Unclosed connections | Ensure `finally:` blocks close sessions |
