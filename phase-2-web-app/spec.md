# Phase II: Todo Full-Stack Web Application - Specification

## Overview
Transform the Phase I console application into a modern multi-user web application with persistent storage, RESTful API, and authentication.

**Points**: 150 | **Due Date**: Dec 14, 2025

## Purpose
Evolve the in-memory console app into a full-stack web application with database persistence and user authentication.

## Dependencies

**Predecessor Phase**: Phase I - Console App
- Inherits: Data models (Task), business logic concepts, validation rules

**Successor Phase**: Phase III - AI Chatbot
- Provides: Backend API, authentication, database schema, web frontend

## User Stories

### US-1: User Registration & Login
**As a user, I want to create an account and sign in, so I can manage my personal todo list securely.**

### US-2: Add Task via Web Interface
**As a user, I want to add tasks through a web form, so I can manage todos from my browser.**

### US-3: View My Tasks
**As a user, I want to see all my tasks in a web interface, so I can track my progress.**

### US-4: Update Task via Web
**As a user, I want to edit task details in the web UI, so I can keep information current.**

### US-5: Delete Task via Web
**As a user, I want to remove tasks from the web interface, so I can clean up my list.**

### US-6: Toggle Task Completion
**As a user, I want to mark tasks complete/incomplete with a click, so I can quickly update status.**

### US-7: Filter Tasks by Status
**As a user, I want to filter tasks by pending/completed/all, so I can focus on what matters.**

## Functional Requirements

### FR-1: User Authentication
- System shall support user registration with email and password
- System shall support user login with email and password
- System shall issue JWT tokens upon successful authentication
- System shall verify JWT tokens on all API requests
- System shall enforce user data isolation (users only see their own tasks)

### FR-2: RESTful API
- System shall provide REST API endpoints for task CRUD operations
- System shall use JWT authentication on all endpoints
- System shall use URL pattern: `/api/{user_id}/tasks`
- System shall return JSON responses with consistent structure
- System shall handle errors with appropriate HTTP status codes

### FR-3: Database Persistence
- System shall use Neon Serverless PostgreSQL
- System shall use SQLModel for ORM
- System shall persist tasks across application restarts
- System shall maintain task-user relationships
- System shall support multiple concurrent users

### FR-4: Frontend Web Interface
- System shall provide responsive web UI using Next.js 16+
- System shall use App Router architecture
- System shall integrate Better Auth for authentication
- System shall display tasks with visual completion indicators
- System shall provide forms for task CRUD operations

### FR-5: Task CRUD Operations
- System shall create tasks with title and description
- System shall read all tasks for authenticated user
- System shall update task details
- System shall delete tasks
- System shall toggle task completion status

### FR-6: Security
- System shall use JWT tokens with shared secret
- System shall validate user ownership on all operations
- System shall hash passwords securely
- System shall prevent SQL injection via ORM
- System shall protect against XSS attacks

## Data Models

### User Model (Managed by Better Auth)
```typescript
{
  id: string;           // User ID (UUID or string)
  email: string;        // User email (unique)
  name: string;         // User display name
  created_at: timestamp;

### Task Model (Evolved from Phase I)

**Phase I Reference**: `phase-1-console-app/src/models.py:15-45`

**Phase I Model (Python dataclass):**
```python
# phase-1-console-app/src/models.py:15-45
@dataclass
class Task:
    """Represents a todo task with all required attributes."""
    id: int
    title: str  # 1-200 chars, validated in __post_init__
    description: str = ""  # 0-1000 chars, validated
    completed: bool = False
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        """Validate task attributes after initialization."""
        # Validate title length (1-200 characters)
        if not self.title or len(self.title) < 1:
            raise ValueError("Title must be at least 1 character")
        if len(self.title) > 200:
            raise ValueError("Title cannot exceed 200 characters")

        # Validate description length (0-1000 characters)
        if len(self.description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")
```

**Phase II Model (SQLModel - Database backed with user support):**
```python
# Inherited structure with user_id field added for multi-user support
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str          # NEW: Foreign key to users.id for multi-user support
    title: str            # Inherited: 1-200 characters, validated via Field constraints
    description: str | None = None  # Inherited: 0-1000 characters, nullable
    completed: bool = Field(default=False)  # Inherited
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
    updated_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
```

**Validation Rules (Inherited from Phase I):**
- Title: 1-200 characters (required) - same validation as Phase I
- Description: 0-1000 characters (optional) - same validation as Phase I
- Validation implemented via SQLModel Field constraints + Pydantic validators
- Same business rules as Phase I console app, now enforced at API level

**Key Differences from Phase I:**
| Aspect | Phase I (Console) | Phase II (Web) |
|--------|-------------------|-----------------|
| Storage | In-memory (dict/list) | Neon PostgreSQL (persistent) |
| Model | Python dataclass | SQLModel with database table |
| User Support | Single user only | Multi-user with `user_id` field |
| Access | Direct method calls | REST API endpoints |
| Validation | `__post_init__` method | SQLModel Field + Pydantic |

