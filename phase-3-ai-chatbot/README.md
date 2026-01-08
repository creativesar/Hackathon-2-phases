# Phase III: AI Chatbot - Complete Implementation Guide

## Overview

Phase III adds an AI-powered conversational interface to the Todo application using OpenAI Agents SDK and MCP (Model Context Protocol) tools. Users can manage their tasks through natural language conversations.

## Features

### ✅ Implemented Features

1. **AI-Powered Chat Interface**
   - Natural language task management
   - Conversational UI with message history
   - Real-time responses from GPT-4o

2. **MCP Tools (5 Tools)**
   - `add_task`: Create new tasks
   - `list_tasks`: View tasks with filtering
   - `complete_task`: Toggle task completion
   - `delete_task`: Remove tasks
   - `update_task`: Modify task details

3. **Conversation Persistence**
   - All conversations saved to database
   - Message history maintained
   - Resume conversations after server restart

4. **Stateless Architecture**
   - Horizontal scaling ready
   - No server-side session state
   - Database-backed conversation storage

5. **Security**
   - JWT authentication on all endpoints
   - User isolation enforced
   - Input validation on all tools

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │         ChatInterface Component                   │  │
│  │  - Message display                                │  │
│  │  - Input handling                                 │  │
│  │  - Tool call indicators                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ POST /api/{user_id}/chat
                      │ (JWT authenticated)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                Backend (FastAPI + Python)               │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Chat API Endpoint                       │  │
│  │  1. Load/create conversation                      │  │
│  │  2. Store user message                            │  │
│  │  3. Load conversation history                     │  │
│  │  4. Run OpenAI Agent                              │  │
│  │  5. Store assistant response                      │  │
│  │  6. Return response (stateless)                   │  │
│  └───────────────────────────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐  │
│  │         OpenAI Agents SDK (GPT-4o)                │  │
│  │  - Agent with instructions                        │  │
│  │  - Runner for execution                           │  │
│  │  - Tool selection logic                           │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐  │
│  │              MCP Server                           │  │
│  │  - 5 function tools                               │  │
│  │  - Database integration                           │  │
│  │  - Validation & error handling                    │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐  │
│  │         Database (Neon PostgreSQL)                │  │
│  │  - users (Phase II)                               │  │
│  │  - tasks (Phase II)                               │  │
│  │  - conversations (Phase III)                      │  │
│  │  - messages (Phase III)                           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | Next.js | 16.1.1 |
| Frontend Language | TypeScript | 5.9.3 |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | 4.1.18 |
| Backend Framework | FastAPI | 0.104.0+ |
| Backend Language | Python | 3.12+ |
| AI Framework | OpenAI Agents SDK | 0.6.5 |
| MCP SDK | Official MCP SDK | 1.25.0 |
| Database | Neon PostgreSQL | Serverless |
| ORM | SQLModel | 0.0.14+ |
| Authentication | Better Auth + JWT | 1.4.9 |
| AI Model | GPT-4o | Latest |

## Prerequisites

1. **Node.js** 20+ and npm
2. **Python** 3.12+
3. **Neon PostgreSQL** account and database
4. **OpenAI API** key with GPT-4o access
5. **Git** for version control

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd Hackathon-2-phases
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# OR using uv (faster):
uv sync

# Create .env file
cp .env.example .env
```

**Edit backend/.env:**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
OPENAI_API_KEY=sk-your-openai-api-key-here
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
CORS_ORIGINS=http://localhost:3000
```

### 3. Database Setup

**Option A: Using Neon SQL Editor (Recommended)**

1. Open Neon Console
2. Select your database
3. Go to SQL Editor
4. Execute `backend/schema.sql` (Phase II tables)
5. Execute `backend/schema_phase3.sql` (Phase III tables)

**Option B: Using Python Migration Script**

```bash
cd backend
python migrate_phase3.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local
```

**Edit frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Build

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Usage

### 1. Create Account

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Enter email, password, and name
4. Sign in with credentials

### 2. Access Chat Interface

1. Navigate to http://localhost:3000/en/chat
2. Start chatting with TodoBot

### 3. Natural Language Commands

**Add Tasks:**
```
"Add a task to buy groceries"
"I need to remember to call mom"
"Create a task for submitting the report"
```

**List Tasks:**
```
"Show me all my tasks"
"What's on my todo list?"
"Show me pending tasks"
"What have I completed?"
```

**Complete Tasks:**
```
"Mark task 1 as complete"
"I finished the groceries task"
"Task 2 is done"
```

**Delete Tasks:**
```
"Delete task 3"
"Remove the meeting task"
"Cancel task 1"
```

**Update Tasks:**
```
"Change task 1 to 'Call mom tonight'"
"Update task 2 description"
"Rename task 3"
```

## API Endpoints

### Phase III Endpoints

**POST /api/{user_id}/chat**
- Send chat message to AI assistant
- Requires JWT authentication
- Request: `{conversation_id?: number, message: string}`
- Response: `{conversation_id: number, response: string, tool_calls?: array}`

### Phase II Endpoints (Still Available)

- GET /api/{user_id}/tasks - List all tasks
- POST /api/{user_id}/tasks - Create task
- GET /api/{user_id}/tasks/{task_id} - Get task
- PUT /api/{user_id}/tasks/{task_id} - Update task
- DELETE /api/{user_id}/tasks/{task_id} - Delete task
- PATCH /api/{user_id}/tasks/{task_id}/complete - Toggle completion

## Database Schema

### Phase III Tables

**conversations**
```sql
id              SERIAL PRIMARY KEY
user_id         TEXT NOT NULL (FK → users.id)
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**messages**
```sql
id              SERIAL PRIMARY KEY
user_id         TEXT NOT NULL (FK → users.id)
conversation_id INTEGER NOT NULL (FK → conversations.id)
role            VARCHAR(20) CHECK (role IN ('user', 'assistant'))
content         TEXT NOT NULL
tool_calls      TEXT (JSON string)
created_at      TIMESTAMP DEFAULT NOW()
```

## Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

**Quick Test:**
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### Common Issues

**1. "OPENAI_API_KEY not set"**
- Add `OPENAI_API_KEY=sk-...` to backend/.env
- Restart backend server

**2. "Table 'conversations' doesn't exist"**
- Run `backend/schema_phase3.sql` in Neon SQL Editor
- OR run `python migrate_phase3.py`

**3. "403 Forbidden" on chat endpoint**
- Ensure JWT token is valid
- Check user_id in URL matches token
- Sign in again if token expired

**4. Agent doesn't respond**
- Check OpenAI API key is valid
- Verify GPT-4o access on your account
- Check backend logs for errors

**5. Messages not persisting**
- Verify database connection
- Check conversations and messages tables exist
- Review backend logs for database errors

**6. Frontend can't connect to backend**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Ensure CORS is configured correctly

## Project Structure

```
Hackathon-2-phases/
├── backend/
│   ├── agent.py                 # OpenAI Agent definition & runner
│   ├── mcp_server.py            # MCP tools implementation
│   ├── models.py                # Database models (Phase II + III)
│   ├── main.py                  # FastAPI app
│   ├── db.py                    # Database connection
│   ├── routes/
│   │   ├── auth.py              # Authentication routes
│   │   ├── tasks.py             # Task management routes
│   │   └── chat.py              # Chat API endpoint (Phase III)
│   ├── services/
│   │   └── task_service.py      # Task business logic
│   ├── middleware/
│   │   └── auth.py              # JWT verification
│   ├── schemas/
│   │   └── task.py              # Pydantic schemas
│   ├── schema.sql               # Phase II database schema
│   ├── schema_phase3.sql        # Phase III database schema
│   ├── migrate_phase3.py        # Migration script
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/
│   │   │       ├── chat/
│   │   │       │   └── page.tsx # Chat page (Phase III)
│   │   │       └── (protected)/
│   │   │           └── tasks/   # Task management UI
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx # Chat UI (Phase III)
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   └── lib/
│   │       ├── api.ts           # API client
│   │       ├── types.ts         # TypeScript types
│   │       └── auth.ts          # Auth utilities
│   └── package.json
└── phase-3-ai-chatbot/
    ├── tasks.md                 # Task breakdown
    ├── plan.md                  # Architecture plan
    ├── TESTING.md               # Testing guide
    └── README.md                # This file
```

## Development Workflow

1. **Backend Development**
   - Modify Python files in `backend/`
   - FastAPI auto-reloads on changes
   - Test with `/docs` interactive API

2. **Frontend Development**
   - Modify TypeScript/React files in `frontend/src/`
   - Next.js auto-reloads on changes
   - View at http://localhost:3000

3. **Database Changes**
   - Update models in `backend/models.py`
   - Create migration SQL in `backend/schema_phase3.sql`
   - Run migration in Neon Console

## Performance Considerations

1. **Database Indexes**
   - Conversation history queries optimized
   - User isolation queries indexed
   - Message ordering indexed

2. **Stateless Design**
   - No server-side sessions
   - Horizontal scaling ready
   - Load balancer compatible

3. **Connection Pooling**
   - Neon connection pooling enabled
   - Pool pre-ping for sleep mode
   - Connection recycling every 5 minutes

## Security

1. **Authentication**
   - JWT tokens for all API calls
   - Token expiration enforced
   - User isolation at database level

2. **Input Validation**
   - All MCP tools validate inputs
   - SQL injection prevented (ORM)
   - XSS prevention in frontend

3. **API Security**
   - CORS configured
   - Rate limiting recommended (not implemented)
   - HTTPS required in production

## Future Enhancements

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Task categories and tags
- [ ] Recurring tasks
- [ ] Task sharing between users
- [ ] Mobile app
- [ ] Offline mode
- [ ] Task reminders/notifications

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: [your-email]
- Documentation: This README

## Acknowledgments

- OpenAI for Agents SDK and GPT-4o
- Neon for serverless PostgreSQL
- FastAPI and Next.js communities

---

**Phase III: AI Chatbot** - Completed Implementation
Built with ❤️ using OpenAI Agents SDK, FastAPI, and Next.js
