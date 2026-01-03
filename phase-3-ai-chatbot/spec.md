# Phase III: Todo AI Chatbot - Specification

## Overview
Transform Phase II web application into an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture.

**Points**: 200 | **Due Date**: Dec 21, 2025

## Purpose
Add conversational interface to todo application using OpenAI ChatKit, Agents SDK, and Official MCP SDK.

## Dependencies

**Predecessor Phase**: Phase II - Web Application
- Inherits: Backend API (FastAPI), authentication (Better Auth + JWT), database schema (Neon PostgreSQL), web frontend (Next.js)

**Successor Phase**: Phase IV - Kubernetes Deployment
- Provides: Complete application stack ready for containerization

## User Stories

### US-1: Natural Language Task Management
**As a user, I want to manage my todos by speaking naturally, so I don't need to learn UI controls.**

### US-2: Chatbot Context Awareness
**As a user, I want the chatbot to remember our conversation, so I can continue where I left off.**

### US-3: Multi-User Isolation
**As a user, I want the chatbot to only access my tasks, so my data remains private.**

### US-4: Error Recovery
**As a user, I want helpful error messages when I speak unclearly, so I know how to rephrase.**

## Functional Requirements

### FR-1: Conversational Interface
- System shall provide chat interface (OpenAI ChatKit)
- System shall support natural language input for all task operations
- System shall display AI responses in conversation format
- System shall maintain chat history visually

### FR-2: OpenAI Agents Integration
- System shall use OpenAI Agents SDK for AI logic
- System shall use Agent Runner for orchestration
- System shall support tool calling
- System shall maintain agent state

### FR-3: MCP Server
- System shall implement MCP server with Official MCP SDK
- System shall expose task operations as MCP tools
- System shall ensure MCP tools are stateless
- System shall store tool state in database

### FR-4: MCP Tools
System shall expose the following MCP tools:

#### Tool: add_task
- Purpose: Create a new task
- Parameters: `user_id` (string, required), `title` (string, required), `description` (string, optional)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "title": "Buy groceries", "description": "Milk, eggs, bread"}`
  - Output: `{"task_id": 5, "status": "created", "title": "Buy groceries"}`

#### Tool: list_tasks
- Purpose: Retrieve tasks from list
- Parameters: `user_id` (string, required), `status` (string, optional: "all", "pending", "completed")
- Returns: Array of task objects
- Example:
  - Input: `{"user_id": "ziakhan", "status": "pending"}`
  - Output: `[{"id": 1, "title": "Buy groceries", "completed": false}, ...]`

#### Tool: complete_task
- Purpose: Mark a task as complete
- Parameters: `user_id` (string, required), `task_id` (integer, required)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 3}`
  - Output: `{"task_id": 3, "status": "completed", "title": "Call mom"}`

#### Tool: delete_task
- Purpose: Remove task from list
- Parameters: `user_id` (string, required), `task_id` (integer, required)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 2}`
  - Output: `{"task_id": 2, "status": "deleted", "title": "Old task"}`

#### Tool: update_task
- Purpose: Modify task title or description
- Parameters: `user_id` (string, required), `task_id` (integer, required), `title` (string, optional), `description` (string, optional)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 1, "title": "Buy groceries and fruits"}`
  - Output: `{"task_id": 1, "status": "updated", "title": "Buy groceries and fruits"}`

### FR-5: Chat API Endpoint
- Endpoint: `POST /api/{user_id}/chat`
- Parameters: `conversation_id` (optional), `message` (required)
- Returns: `conversation_id`, `response`, `tool_calls`
- System shall be stateless (server holds no conversation state)
- System shall persist conversations to database


### FR-6: Database Models (Evolved from Phase II)

**Phase II Reference**: `phase-2-web-app/backend/app/models.py`

**Phase II Task Model (Inherited):**
```python
# phase-2-web-app/backend/app/models.py
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str          # Inherited from Phase II
    title: str            # Inherited from Phase II
    description: str | None = None  # Inherited from Phase II
    completed: bool = Field(default=False)  # Inherited from Phase II
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
    updated_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
```

**Phase III Models (New - Added for Chatbot):**

#### Conversation Model (NEW)
```python
# NEW: For managing chat sessions in Phase III
class Conversation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str              # Links to user (from Phase II)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Key
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
```

#### Message Model (NEW)
```python
# NEW: For storing conversation history in Phase III
class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str              # Inherited from Phase II user model
    conversation_id: int       # Links to Conversation (NEW)
    role: str                 # "user" or "assistant" (NEW)
    content: str              # Chat message text (NEW)
    tool_calls: JSON | None = None  # MCP tools called (NEW)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Keys
    __table_args__ = (
        ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
```

**Database Evolution Summary:**
| Model | Origin | Phase II | Phase III |
|--------|---------|----------|----------|
| Task | Phase I → II | ✅ Inherited | ✅ Used by MCP tools |
| User | Phase II | ✅ Better Auth | ✅ Links to conversations |
| Conversation | — | — | ➕ NEW (chat sessions) |
| Message | — | — | ➕ NEW (chat history) |

**Phase II → III Integration:**
- Task model unchanged (Phase II MCP tools work directly with it)
- User model inherited (Better Auth from Phase II)
- New models: Conversation, Message for chat functionality
- Foreign keys maintain referential integrity with Phase II tables

