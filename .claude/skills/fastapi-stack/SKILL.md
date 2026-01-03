---
name: fastapi-stack
description: FastAPI backend development patterns for Hackathon II Todo App (backend folder). Use when implementing routes, models, middleware, or FastAPI-specific features. Project uses: (1) FastAPI 0.104+, (2) SQLModel 0.0.14, (3) asyncpg 0.29+, (4) Python-JOSE for JWT, (5) pydantic 2.5+, (6) Better Auth JWT integration, (7) OpenAI Agents SDK (Phase 3+)
---

# FastAPI Backend Stack - Hackathon II

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point, CORS, include routers
├── models.py            # SQLModel models (Task, User, Conversation, Message)
├── db.py                # Database connection, async engine, get_session
├── routes/
│   ├── __init__.py      # Router aggregation
│   ├── tasks.py         # Task CRUD endpoints
│   └── auth.py          # Auth endpoints (optional)
├── middleware/
│   ├── __init__.py
│   └── auth.py          # JWT verification middleware
├── schemas/
│   ├── __init__.py
│   └── task.py          # Pydantic request/response models
└── tests/
    ├── conftest.py       # Pytest fixtures
    └── test_tasks.py     # Integration tests
```

## Main App Setup

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routes import tasks, auth

# Import models
from models import Task
from db import engine, init_db

# Create FastAPI app
app = FastAPI(
    title="Todo API - Hackathon II",
    version="1.0.0",
    description="Task management API with JWT authentication"
)

# CORS middleware for frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router)
app.include_router(auth.router, prefix="/auth")

# Startup event - create tables
@app.on_event("startup")
async def startup_event():
    init_db()

# Health check endpoint (no auth required)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "todo-backend"}
```

## Database Connection

```python
# db.py
from sqlmodel import SQLModel, create_engine, Session, select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator
import os

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create async engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging in production
    pool_size=10,  # Maintain 10 connections
    max_overflow=20,  # Allow 20 overflow connections
    pool_pre_ping=True,  # Verify connections before use
)

def init_db():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)

def get_session() -> AsyncGenerator[AsyncSession, None, None]:
    """Dependency injection for FastAPI routes."""
    async with AsyncSession(engine) as session:
        yield session
```

## SQLModel Models

```python
# models.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

# Task model
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(index=True, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="tasks")

# User model (managed by Better Auth, but define for relationships)
class User(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    email: str = Field(index=True, max_length=255)
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: list["Task"] = Relationship(back_populates="user")

# Conversation model (Phase III - AI Chat)
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    messages: list["Message"] = Relationship(back_populates="conversation")

# Message model (Phase III - Chat History)
class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: str = Field(index=True)  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    conversation: Optional[Conversation] = Relationship(back_populates="messages")
```

## JWT Authentication

```python
# middleware/auth.py
from fastapi import Depends, HTTPException, Header, status
from jose import jwt, JWTError
from typing import Optional
import os

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> str:
    """
    Extract and verify JWT token from Authorization header.
    Returns user_id from token 'sub' claim.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = payload.get("sub") or payload.get("userId")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

## Task Routes

```python
# routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional, List
from datetime import datetime

from ..models import Task
from ..db import get_session
from ..middleware.auth import get_current_user
from ..schemas.task import TaskCreate, TaskUpdate, TaskRead

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskRead])
async def list_tasks(
    user_id: str,  # From URL path
    completed: Optional[bool] = None,  # Query parameter
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """List all tasks for authenticated user."""
    # Verify user matches authenticated user
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    query = select(Task).where(Task.user_id == user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    tasks = session.exec(query).all()
    return tasks

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """Create a new task."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    db_task = Task.model_validate(task)
    db_task.user_id = user_id
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """Get a specific task."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task

@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """Update a task."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(task, key, value)
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """Delete a task."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()

@router.patch("/{task_id}/complete", response_model=TaskRead)
async def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """Toggle task completion status."""
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User ID mismatch"
        )

    task = session.get(Task, task_id)

    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

## Pydantic Schemas

```python
# schemas/task.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    """Schema for creating a task."""
    title: str  # Required, max 200 chars
    description: Optional[str] = None  # Optional, max 1000 chars

    class Config:
        json_schema_extra = "forbid"  # Forbid extra fields

class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

    class Config:
        json_schema_extra = "forbid"

class TaskRead(BaseModel):
    """Schema for reading a task (includes timestamps)."""
    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

## Environment Variables

Create `.env` file in backend folder:

```bash
# .env
DATABASE_URL=postgresql://user:password@ep-host.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-here  # MUST match frontend
OPENAI_API_KEY=sk-...  # Phase 3+
```

## Running Locally

```bash
# Install dependencies
uv pip install -e .

# Run development server
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# API available at http://localhost:8000
# Health check at http://localhost:8000/health
```

## Testing

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_user_token():
    """Return a test JWT token."""
    # In real tests, create user and get token
    return "test-jwt-token"

# tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient

def test_create_task(client: TestClient):
    response = client.post(
        "/api/user123/tasks",
        json={"title": "Test task", "description": "Test description"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test task"

def test_list_tasks(client: TestClient):
    response = client.get("/api/user123/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)

def test_task_requires_auth(client: TestClient):
    response = client.get("/api/user123/tasks")
    # Should return 401 without Authorization header
    assert response.status_code == 401
```

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|-----------|----------------|-------------|
| GET | `/health` | No | Health check |
| GET | `/api/{user_id}/tasks` | Yes | List tasks (filter by `?completed=true/false`) |
| POST | `/api/{user_id}/tasks` | Yes | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Yes | Get task |
| PUT | `/api/{user_id}/tasks/{id}` | Yes | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Yes | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Yes | Toggle completion |

## Quick Reference

| Task | Code Pattern |
|------|-------------|
| Create router | `router = APIRouter(prefix="/...", tags=["..."])` |
| Auth dependency | `current_user: str = Depends(get_current_user)` |
| DB session | `session: Session = Depends(get_session)` |
| Verify user | `if user_id != current_user: raise 403` |
| Query tasks | `select(Task).where(Task.user_id == user_id)` |
| Create record | `session.add(model); session.commit()` |
| Update record | `setattr(model, key, value); session.commit()` |
| Delete record | `session.delete(model); session.commit()` |
| Error response | `raise HTTPException(status_code=404, detail="...")` |

## Project-Specific Rules

1. **All routes under `/api/` prefix**
2. **User ID in URL must match JWT token** (403 Forbidden if mismatch)
3. **All endpoints require JWT** except `/health`
4. **Return proper HTTP status codes**: 201 (created), 204 (no content), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
5. **Use async/await for all route handlers**
6. **SQLModel for all DB operations** - no raw SQL
7. **Connection pooling enabled** - pool_size=10, max_overflow=20
8. **Pydantic schemas for validation** - forbid extra fields
9. **Always validate user ownership** before CRUD operations
10. **Better Auth secret must match frontend** - store in `.env`

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| 401 Unauthorized | Missing/expired token | Check Authorization header format: `Bearer <token>` |
| 403 Forbidden | User ID mismatch | Verify URL user_id matches JWT sub claim |
| 404 Not Found | Wrong task_id | Check task exists and belongs to user |
| Connection error | Wrong DATABASE_URL | Verify Neon connection string format |
| Pool exhausted | Too many connections | Increase pool_size in engine config |
| Model validation error | Extra fields in request | Check Pydantic schema, use `model_dump(exclude_unset=True)` |
