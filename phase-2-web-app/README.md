# Phase II: Todo Full-Stack Web Application

A modern multi-user todo application built with Next.js (frontend) and FastAPI (backend) with persistent storage, RESTful API, and JWT authentication.

## Project Overview

This is Phase II of a 5-phase hackathon project that evolves a simple console app into a full-stack, cloud-native application with AI chatbot capabilities.

**Phase II Focus**: Transform the in-memory console app into a modern web application with:
- Multi-user support with data isolation
- Persistent database storage (Neon PostgreSQL)
- RESTful API (FastAPI)
- JWT authentication (Better Auth)
- Responsive web UI (Next.js 16+)

## Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **Authentication**: Better Auth (JWT)
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.13+
- **ORM**: SQLModel 0.0.14+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (python-jose)
- **Server**: uvicorn 0.30+
- **Deployment**: Render/Railway

## Project Structure

```
Hackathon-2-phases/
├── frontend/                    # Next.js Application (shared)
│   ├── app/                    # App Router
│   │   ├── (auth)/            # Auth group layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard
│   │   └── globals.css
│   ├── components/             # Reusable components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── AuthForm.tsx
│   │   └── FilterControls.tsx
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # API client
│   │   └── auth.ts            # Auth utilities
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── CLAUDE.md
│
├── backend/                     # FastAPI Application (shared)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry
│   │   ├── config.py          # Configuration
│   │   ├── db.py              # Database connection
│   │   ├── models.py          # SQLModel models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── auth.py            # JWT middleware
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tasks.py       # Task CRUD endpoints
│   ├── tests/
│   ├── pyproject.toml
│   └── CLAUDE.md
│
├── phase-2-web-app/             # Phase II Documentation Only
│   ├── docs/                  # Documentation
│   │   ├── spec.md           # Requirements
│   │   ├── plan.md           # Architecture plan
│   │   └── tasks.md         # Implementation tasks
│   ├── CLAUDE.md              # Phase-specific Claude instructions
│   └── README.md              # This file
```

## Prerequisites

- **Node.js**: 18+ (for frontend)
- **Python**: 3.13+ (for backend)
- **UV**: Latest Python package manager
- **Neon PostgreSQL account**: For database
- **Vercel account**: For frontend deployment
- **Better Auth secret**: Generate a strong secret

## Installation

### Backend Setup

```bash
cd backend

# Create virtual environment with UV
uv venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/Mac:
source .venv/bin/activate

# Install dependencies
uv sync
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Environment Variables

### Backend Environment (`.env`)

```bash
DATABASE_URL=postgresql://user:password@host/db
BETTER_AUTH_SECRET=your-super-secret-key-here
```

### Frontend Environment (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-key-here
```

**Important**: `BETTER_AUTH_SECRET` must be the same for both frontend and backend for JWT verification.

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

## Features

### Basic Features (All Implemented)
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Create tasks via web form
- ✅ List all tasks with status indicators
- ✅ Update task details
- ✅ Delete tasks with confirmation
- ✅ Toggle task completion (one-click)
- ✅ Filter tasks by status (All/Pending/Completed)
- ✅ Multi-user support with data isolation
- ✅ Persistent database storage

### Advanced Features (Planned for Phases III-V)
- AI-powered chatbot (Phase III)
- Real-time updates (Phase IV)
- Task priorities and tags (Phase V)
- Due dates and reminders (Phase V)
- Search functionality (Phase V)

## API Endpoints

All endpoints require JWT authentication.

### Base URL
- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

### Authentication
```
Authorization: Bearer <token>
```

### Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| GET | `/api/{user_id}/tasks?status=pending` | Filter tasks by status |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get single task |
| PUT | `/api/{user_id}/tasks/{id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion |

See `docs/spec.md` for detailed API documentation.

## Database Schema

### tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### users Table
Managed by Better Auth - includes id, email, name, created_at.

## Security

- JWT tokens expire after 7 days
- Passwords hashed with bcrypt
- All database queries filtered by user_id (data isolation)
- CORS properly configured
- Input validation on all endpoints
- SQL injection prevention via ORM

## Development Workflow

1. **Branch**: Create feature branch from `main`
2. **Develop**: Implement features according to `docs/tasks.md`
3. **Test**: Manual testing and API validation
4. **Commit**: Use conventional commit messages
5. **Push**: Push to GitHub
6. **PR**: Create pull request for review

## Testing

### Manual Testing
1. Test user registration and login
2. Test all CRUD operations
3. Test authentication (valid/invalid tokens)
4. Test user data isolation
5. Test error handling

### API Testing
```bash
# Get tasks (with auth)
curl -X GET http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <token>"

# Create task
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "description": "Test description"}'
```

## Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `BETTER_AUTH_SECRET`
4. Deploy automatically on push

### Backend (Render/Railway)

1. Connect GitHub repository
2. Configure Python environment:
   - Build Command: `uv sync && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
4. Deploy automatically on push

### Database (Neon)

1. Create project on Neon (neon.tech)
2. Get connection string (`DATABASE_URL`)
3. Add to backend environment variables
4. Run migrations: `alembic upgrade head`

## Migration from Phase I

### What Changed
- Data Storage: In-memory → PostgreSQL
- User Interface: CLI → Web UI
- Architecture: Single-process → Client-Server
- Auth: None → JWT + Better Auth
- Multi-user: No → Yes

### What Stayed Same
- Task Model Structure (same attributes)
- Validation Rules (title 1-200, description 0-1000)
- Business Logic Concepts (CRUD operations)
- Status Management (completion toggle)

## Preparation for Phase III

This phase provides the foundation for Phase III (AI Chatbot):
- Complete backend API with authentication
- Database schema ready for Message model
- Web frontend ready for chat integration
- MCP server architecture foundation

## Success Criteria

- ✅ All 5 Basic Level features as web app
- ✅ Multi-user support with data isolation
- ✅ JWT authentication working
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed and accessible
- ✅ Database connected and persisting data
- ✅ Demo video under 90 seconds

## Known Limitations

- Single JWT token approach (no refresh tokens in Phase II)
- No real-time updates (WebSocket in Phase IV)
- No advanced task features (priorities, tags, due dates in Phase V)
- No multi-language support (Bonus feature)

## Support

For issues or questions:
- Check `docs/spec.md` for requirements
- Check `docs/plan.md` for architecture decisions
- Check `docs/tasks.md` for implementation details
- Check `backend/CLAUDE.md` for backend-specific guidance
- Check `frontend/CLAUDE.md` for frontend-specific guidance

## License

Hackathon Project - Spec-Driven Development

## Credits

Built using Spec-Driven Development methodology with Claude Code and Spec-Kit Plus.
