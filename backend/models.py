"""
SQLModel database models for Todo application
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """
    SQLModel representation of users table.
    Used for authentication and task ownership.
    """
    __tablename__ = "users"

    id: Optional[str] = Field(default=None, primary_key=True, max_length=36)
    email: str = Field(unique=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=100)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Task(SQLModel, table=True):
    """
    SQLModel representation of tasks table.
    Also serves as Pydantic model for API validation.

    Phase 5 Advanced Features:
    - due_date: Optional deadline for task completion
    - recurrence: Pattern for recurring tasks ("daily", "weekly", "monthly")
    - reminder_sent: Flag to track if reminder notification has been sent
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200, min_length=1)
    description: str = Field(max_length=1000, min_length=1)
    completed: bool = Field(default=False)

    # Phase 5: Advanced features (FR-4, FR-5)
    due_date: Optional[datetime] = Field(default=None, description="Task deadline for reminders and scheduling")
    recurrence: Optional[str] = Field(default=None, max_length=20, description="Recurrence pattern: 'daily', 'weekly', 'monthly', or None")
    reminder_sent: bool = Field(default=False, description="Flag indicating if due date reminder has been sent")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskRecurrence(SQLModel, table=True):
    """
    SQLModel representation of task_recurrences table.
    Tracks recurring task instances and schedules next occurrence.

    Phase 5: Recurring Tasks (FR-4)
    - Stores recurrence pattern and next scheduled date
    - Used by Recurring Task Service to auto-create tasks
    - Maintains history of task generation
    """
    __tablename__ = "task_recurrences"

    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="tasks.id", index=True, description="Original task that defines the recurrence")
    recurrence_type: str = Field(max_length=20, description="Recurrence pattern: 'daily', 'weekly', 'monthly'")
    next_due_date: datetime = Field(description="Next scheduled date for task creation")
    last_created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of last auto-created task")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Conversation(SQLModel, table=True):
    """
    SQLModel representation of conversations table.
    Stores chat conversation metadata for Phase III AI Chatbot.
    """
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(SQLModel, table=True):
    """
    SQLModel representation of messages table.
    Stores individual chat messages within conversations.
    """
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str
    tool_calls: Optional[str] = Field(default=None)  # JSON string of tool calls
    created_at: datetime = Field(default_factory=datetime.utcnow)
