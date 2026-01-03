---
name: neon-database
description: Neon Serverless PostgreSQL database setup for Hackathon II Todo App. Use when setting up database, creating migrations, managing connections, or optimizing queries. Includes: (1) SQLModel integration, (2) Connection pooling, (3) Schema migrations, (4) Query optimization
---

# Neon Database Setup

## Quick Start

### 1. Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Click "Create a Project"
3. Select region (choose closest to your location)
4. Copy connection string

### 2. Get Connection String

```bash
# Example connection string:
postgresql://user:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Environment Variable

```bash
# .env (backend)
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

## SQLModel Integration

### Database Connection Setup

```python
# db.py
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator
import os

# Create engine with connection pooling
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set False in production
    pool_size=10,  # Number of connections to maintain
    max_overflow=20,  # Extra connections allowed
    pool_pre_ping=True,  # Verify connections before use
)

def get_session() -> Generator[Session, None, None]:
    """Dependency for FastAPI routes."""
    with Session(engine) as session:
        yield session

def init_db():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)
```

### Model Definitions

```python
# models.py
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

# User table (managed by Better Auth, but define for reference)
class User(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: list["Task"] = Relationship(back_populates="user")

# Task table
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="tasks")

# Conversation table (Phase III - AI Chat)
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    messages: list["Message"] = Relationship(back_populates="conversation")

# Message table (Phase III - Chat History)
class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: str = Field(index=True)  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    conversation: Conversation = Relationship(back_populates="messages")
```

### Indexes for Performance

```python
# models.py - Enhanced with indexes
class Task(SQLModel, table=True):
    # ... fields ...

    __table_args__ = {
        "postgresql_partition_by": "RANGE (created_at)",
        "postgresql_tablespace": "fast_storage",
    }
```

## Query Patterns

### Basic CRUD

```python
from sqlmodel import Session, select

def create_task(task_data: dict, user_id: str, session: Session):
    """Create a new task."""
    task = Task(**task_data, user_id=user_id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_task(task_id: int, user_id: str, session: Session):
    """Get a single task by ID."""
    return session.get(Task, task_id)

def list_tasks(
    user_id: str,
    completed: Optional[bool] = None,
    session: Session
):
    """List tasks with optional filter."""
    query = select(Task).where(Task.user_id == user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    return session.exec(query).all()

def update_task(
    task_id: int,
    updates: dict,
    user_id: str,
    session: Session
):
    """Update a task."""
    task = get_task(task_id, user_id, session)

    if not task:
        raise ValueError("Task not found")

    for key, value in updates.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(task_id: int, user_id: str, session: Session):
    """Delete a task."""
    task = get_task(task_id, user_id, session)

    if not task:
        raise ValueError("Task not found")

    session.delete(task)
    session.commit()
    return task
```

### Advanced Queries

```python
from sqlmodel import Session, select, col
from datetime import datetime, timedelta

def get_pending_tasks_due_soon(
    user_id: str,
    days: int,
    session: Session
):
    """Get incomplete tasks due within N days."""
    cutoff = datetime.utcnow() + timedelta(days=days)
    query = (
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.completed == False)
        .where(Task.due_date < cutoff)  # If due_date field exists
        .order_by(col(Task.due_date).asc())
    )
    return session.exec(query).all()

def get_tasks_with_stats(user_id: str, session: Session):
    """Get tasks with completion statistics."""
    total = session.exec(
        select(Task)
        .where(Task.user_id == user_id)
    ).all()

    completed = session.exec(
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.completed == True)
    ).all()

    return {
        "total": len(total),
        "completed": len(completed),
        "pending": len(total) - len(completed),
        "completion_rate": len(completed) / len(total) if total else 0,
    }
```

## Migrations

### Schema Evolution

```python
# migrations/001_add_due_date.py
from sqlmodel import SQLModel, Field, Session
from sqlmodel import create_engine, select
import os

def migrate():
    """Add due_date field to Task table."""
    engine = create_engine(os.getenv("DATABASE_URL"))

    with Session(engine) as session:
        # Check if column exists (PostgreSQL specific)
        result = session.exec("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'task'
            AND column_name = 'due_date'
        """)

        if not result.all():
            # Add column
            session.exec("""
                ALTER TABLE task
                ADD COLUMN due_date TIMESTAMP NULL
            """)
            session.commit()
            print("Added due_date column")
        else:
            print("due_date column already exists")

if __name__ == "__main__":
    migrate()
```

### Automated Migrations

```bash
# Using Alembic with SQLModel (recommended for production)
pip install alembic

alembic init alembic

# alembic/env.py
from sqlmodel import SQLModel
from myapp.db import engine

target_metadata = SQLModel.metadata

# Run migration
alembic revision --autogenerate -m "Add due_date to tasks"
alembic upgrade head
```

## Performance Optimization

### Connection Pooling

```python
# db.py - Optimized settings
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging in production
    pool_size=20,  # Increase for high traffic
    max_overflow=30,  # Allow burst traffic
    pool_pre_ping=True,  # Check connection health
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_timeout=30,  # Wait 30s for connection
)
```

### Query Optimization

```python
# BAD: Fetch all tasks and filter in Python
tasks = session.exec(select(Task)).all()
user_tasks = [t for t in tasks if t.user_id == user_id]

# GOOD: Filter in database
tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()

# BETTER: Use select with only needed columns
tasks = session.exec(
    select(Task.id, Task.title, Task.completed)
    .where(Task.user_id == user_id)
).all()
```

### Batch Operations

```python
# Batch insert multiple tasks
def create_tasks_batch(
    tasks_data: list[dict],
    user_id: str,
    session: Session
):
    """Create multiple tasks efficiently."""
    tasks = [Task(**data, user_id=user_id) for data in tasks_data]
    session.add_all(tasks)
    session.commit()
    return tasks

# Batch update
def mark_multiple_complete(
    task_ids: list[int],
    session: Session
):
    """Mark multiple tasks as complete."""
    tasks = session.exec(
        select(Task).where(Task.id.in_(task_ids))
    ).all()

    for task in tasks:
        task.completed = True
        task.updated_at = datetime.utcnow()

    session.add_all(tasks)
    session.commit()
```

## Connection from Frontend

### Next.js Server Component

```tsx
// app/[locale]/(protected)/tasks/page.tsx
import { getTasks } from '@/lib/api'
import { getToken } from '@/lib/auth'

export default async function TasksPage({
  params
}: {
  params: { locale: string, userId: string }
}) {
  // Get JWT token from Better Auth
  const token = await getToken()

  // Fetch tasks from backend (backend connects to Neon)
  const tasks = await getTasks(params.userId)

  return <TaskList tasks={tasks} />
}
```

## Monitoring & Debugging

### Check Connection

```python
# db.py
def test_connection():
    """Test database connection."""
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("Database connection successful!")
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
```

### Log Slow Queries

```python
# db.py
import logging

logging.basicConfig()
logger = logging.getLogger("sqlalchemy.engine")
logger.setLevel(logging.INFO)

engine = create_engine(
    DATABASE_URL,
    echo="debug",  # Log all queries for debugging
)
```

### Neon Dashboard

1. Go to [console.neon.tech](https://console.neon.tech)
2. View metrics: Connections, CPU, Storage
3. Monitor query performance
4. Check connection pool health

## Environment Setup

### Development

```bash
# .env (backend)
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require

# Test connection
python -c "
from db import engine, test_connection
test_connection()
"
```

### Production

```bash
# Set in deployment environment
export DATABASE_URL="postgresql://..."

# Verify
curl -X POST \
  http://your-backend.com/api/test-db \
  -H "Content-Type: application/json"
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| Connection timeout | Network issues | Check firewall, use nearest region |
| Pool exhausted | Too many connections | Increase pool_size in engine |
| Slow queries | Missing indexes | Add indexes on frequently queried fields |
| Schema errors | Outdated models | Run migration script |
| Neon free tier limits | Exceeded limits | Monitor usage in dashboard |

## Quick Reference

| Task | Code Pattern |
|------|-------------|
| Create engine | `create_engine(DATABASE_URL, pool_size=10)` |
| Get session | `session: Session = Depends(get_session)` |
| Query by user | `select(Task).where(Task.user_id == user_id)` |
| Create record | `session.add(model); session.commit()` |
| Update record | `setattr(model, key, value); session.commit()` |
| Delete record | `session.delete(model); session.commit()` |
| Filter with index | `.where(Task.completed == True)` |
| Sort results | `.order_by(col(Task.created_at).desc())` |
| Batch insert | `session.add_all([model1, model2])` |
| Add index | `Field(index=True)` in model definition |

## Best Practices

1. **Use connection pooling** - don't create new engine per request
2. **Always filter by user_id** - prevent data leakage
3. **Use indexes on foreign keys and query fields** - improves performance
4. **Commit transactions promptly** - don't hold locks
5. **Handle connection errors gracefully** - retry on timeout
6. **Use prepared statements** - SQLModel handles this automatically
7. **Monitor connection pool** - adjust pool_size based on traffic
8. **Never hardcode credentials** - use environment variables
9. **Run migrations in production** - don't modify schema manually
10. **Enable SSL for connections** - required by Neon
