# Phase II: Todo Full-Stack Web App - Claude Code Instructions

## Surface
You are operating at the phase level (Phase II), providing guidance for building a full-stack web application.

## Success Criteria
- All implementations strictly follow the user intent and spec-driven development
- All changes reference code precisely with line numbers
- All output is testable and includes acceptance checks
- Prompt History Records (PHRs) are created for every user prompt

## Phase Overview

Phase II transforms the Phase I console app into a modern multi-user web application with:
- **Frontend**: Next.js 16+ with TypeScript, Tailwind CSS, Better Auth
- **Backend**: FastAPI with Python 3.13+, SQLModel, JWT authentication
- **Database**: Neon Serverless PostgreSQL
- **Deployment**: Frontend to Vercel, Backend to Render/Railway

## Core Guarantees

### 1. Spec-Driven Development
- Always read the specification (`docs/spec.md`) before implementing
- Follow the plan (`docs/plan.md`) for architectural decisions
- Execute tasks in order from `docs/tasks.md`
- Mark tasks as completed [X] in tasks.md when done

### 2. Knowledge Capture
- **Must** create PHR for every user prompt (except `/sp.phr` itself)
- Route PHRs: `history/prompts/phase-2-web-app/<ID>-<slug>.<stage>.prompt.md`
- Preserve full user input verbatim (no truncation)
- Stages: spec, plan, tasks, red, green, refactor, explainer, misc

### 3. Code References
- Always cite existing code with precise references: `file_path:start:end`
- Example: `phase-2-web-app/backend/app/main.py:15:20`
- Use line numbers from Read tool output
- Never reference code you haven't read

### 4. Architectural Decisions
- When significant decisions are detected, suggest ADR:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto-create ADRs

## Technology Stack Details

### Frontend (Next.js)
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **Authentication**: Better Auth (JWT)
- **State Management**: React Server Components + useState
- **HTTP Client**: fetch API or axios
- **Deployment**: Vercel

### Backend (FastAPI)
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.13+
- **Package Manager**: UV
- **ORM**: SQLModel 0.0.14+
- **Database**: Neon PostgreSQL
- **Auth**: JWT (python-jose) + Better Auth integration
- **Server**: uvicorn 0.30+
- **Deployment**: Render/Railway

### Dependencies

#### Backend (pyproject.toml)
```toml
[project]
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.30.0",
    "sqlmodel>=0.0.14",
    "psycopg2-binary>=2.9.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "python-dotenv>=1.0.0",
    "alembic>=1.12.0",
]
```

#### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "better-auth": "^1.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

## Project Structure Rules

### Frontend Structure
```
frontend/
├── app/                      # App Router directory
│   ├── (auth)/              # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── layout.tsx           # Root layout with auth provider
│   ├── page.tsx             # Dashboard
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── TaskForm.tsx
│   ├── AuthForm.tsx
│   └── FilterControls.tsx
├── lib/                     # Utility modules
│   ├── api.ts               # API client class
│   └── auth.ts              # Better Auth config
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── CLAUDE.md                # This file
```

### Backend Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration & env vars
│   ├── db.py                # Database connection & session
│   ├── models.py            # SQLModel models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT middleware & utils
│   └── routes/
│       ├── __init__.py
│       └── tasks.py         # Task CRUD endpoints
├── tests/                   # Test files
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_routes.py
│   └── test_auth.py
├── alembic/                 # Database migrations
│   └── versions/
├── pyproject.toml           # UV project config
├── .env                     # Environment variables (gitignored)
└── CLAUDE.md                # Backend-specific instructions
```

## Key Architectural Patterns

### 1. Monorepo Structure
- Frontend and backend in separate directories
- Shared documentation in `docs/`
- Separate deployment pipelines
- Shared environment variables for auth (BETTER_AUTH_SECRET)

### 2. API Authentication Flow
```
User Login (Better Auth)
  → JWT token generated
  → Frontend stores token
  → Frontend makes API requests with token
  → Backend validates JWT with shared secret
  → Backend extracts user_id
  → Backend filters data by user_id
```

### 3. Data Isolation
- **Critical**: All database queries MUST include `user_id` filter
- Never allow queries without user_id
- Validate user_id from JWT matches URL path user_id
- Example:
  ```python
  # CORRECT
  tasks = db.exec(select(Task).where(Task.user_id == user_id)).all()

  # WRONG - Never do this!
  tasks = db.exec(select(Task)).all()
  ```

### 4. REST API Pattern
- URL pattern: `/api/{user_id}/tasks`
- JSON responses with consistent structure
- Proper HTTP status codes (400, 401, 403, 404, 500)
- JWT required on all endpoints

## Implementation Rules

### Before Writing Code
1. **Read** the specification for requirements
2. **Read** the plan for architecture decisions
3. **Read** the task from tasks.md
4. **Read** any related existing code (using Glob/Grep/Read)

### While Writing Code
1. **Cite** all referenced code with `file_path:start:end`
2. **Include** type hints on all functions
3. **Add** docstrings for all public methods
4. **Follow** PEP 8 for Python, ESLint for TypeScript
5. **Validate** against the specification

### After Writing Code
1. **Verify** it matches the task requirements
2. **Update** tasks.md to mark task [X] completed
3. **Create** PHR for the user prompt
4. **Suggest** ADR if architectural decision detected

## Common Patterns

### Backend: Creating a New Endpoint
```python
# backend/app/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_session
from app.models import Task
from app.schemas import TaskRead

router = APIRouter()

@router.get("/{user_id}/tasks", response_model=list[TaskRead])
def get_tasks(
    user_id: str,
    status: str = "all",
    session: Session = Depends(get_session)
):
    # Always filter by user_id!
    query = select(Task).where(Task.user_id == user_id)

    if status == "pending":
        query = query.where(Task.completed == False)
    elif status == "completed":
        query = query.where(Task.completed == True)

    tasks = session.exec(query).all()
    return tasks
```

### Frontend: Creating a New Component
```typescript
// frontend/components/TaskForm.tsx
'use client'

import { useState } from 'react'

export default function TaskForm({ userId, onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call here
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host/db
BETTER_AUTH_SECRET=super-secret-key-256-chars-min
OPENAI_API_KEY=sk-...  # For Phase III
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=super-secret-key-256-chars-min
```

**Critical**: `BETTER_AUTH_SECRET` must be identical on frontend and backend!

## Testing Guidelines

### Manual Testing Required
- User registration and login
- All CRUD operations
- Authentication (valid/invalid tokens)
- User data isolation (User A cannot see User B's tasks)
- Error handling

### API Testing with curl
```bash
# Get tasks
curl -X GET http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer <token>"

# Create task
curl -X POST http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "description": "Test desc"}'
```

## Deployment Checklist

### Backend Deployment
- [ ] All dependencies in pyproject.toml
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] CORS configured for production
- [ ] Health check endpoint working

### Frontend Deployment
- [ ] Environment variables configured
- [ ] Build process works
- [ ] API URL set to production backend
- [ ] Better Auth configured with production secret
- [ ] Production build tested

## Migration from Phase I

### Inherited Concepts
- Task model structure (id, title, description, completed, timestamps)
- Validation rules (title 1-200, description 0-1000)
- CRUD operations (create, read, update, delete, toggle)
- Business logic concepts

### Key Changes
- Add `user_id` field to Task model
- In-memory storage → PostgreSQL
- CLI → Web UI
- No auth → JWT authentication
- Single-user → Multi-user with data isolation

## Preparation for Phase III

This phase prepares for Phase III (AI Chatbot) by:
- Providing complete backend API
- Setting up authentication system
- Creating database schema (Task + Message models ready)
- Building web frontend for chat integration
- Establishing MCP server foundation

## Common Pitfalls to Avoid

1. **Missing user_id filter**: Always filter database queries by user_id
2. **Hardcoded secrets**: Never commit secrets, use environment variables
3. **CORS issues**: Configure CORS for both dev and production
4. **JWT secret mismatch**: Ensure BETTER_AUTH_SECRET matches on both ends
5. **SQL injection**: Always use ORM (SQLModel), never raw SQL
6. **Missing validation**: Validate all inputs on both frontend and backend
7. **Forgetting migrations**: Use Alembic for all schema changes

## PHR Creation

**When to create PHRs**:
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Multi-step workflows

**Stages**:
- `spec` - Specification work
- `plan` - Architecture planning
- `tasks` - Task breakdown
- `green` - Implementation code
- `red` - Test code
- `refactor` - Refactoring
- `explainer` - Documentation
- `misc` - General work

**Routing**:
- Constitution → `history/prompts/constitution/`
- Phase II work → `history/prompts/phase-2-web-app/`
- General → `history/prompts/general/`

## Success Metrics

For this phase, success means:
- All 5 Basic Level features implemented as web app
- Multi-user support with proper data isolation
- JWT authentication working end-to-end
- Frontend deployed to Vercel
- Backend deployed and accessible
- Database connected and persisting data
- Demo video under 90 seconds

## Getting Help

When you encounter issues:
1. Check `docs/spec.md` for requirements
2. Check `docs/plan.md` for architecture
3. Check `docs/tasks.md` for implementation details
4. Use Glob/Grep to find related code
5. Read existing code to understand patterns
6. Ask clarifying questions if requirements are unclear

## Remember

- **Spec first**: Always read before implementing
- **Test thoroughly**: Validate everything works
- **Document everything**: Create PHRs for all work
- **Cite precisely**: Reference code with line numbers
- **Think ahead**: Prepare for Phase III
