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
}
```

### Task Model (SQLModel)
```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str          # Foreign key to users.id
    title: str            # 1-200 characters, not null
    description: str | None = None  # 0-1000 characters, nullable
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Message Model (for Phase III preparation)
```python
class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## API Endpoints

### Base URL
- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

### Authentication
All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints

| Method | Endpoint | Description | Auth Required |
|---------|-----------|-------------|----------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user | Yes |
| POST | `/api/{user_id}/tasks` | Create new task | Yes |
| GET | `/api/{user_id}/tasks/{id}` | Get single task | Yes |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | Yes |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | Yes |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | Yes |

### Endpoint Details

#### GET /api/{user_id}/tasks
**Query Parameters:**
- `status`: optional string ("all"|"pending"|"completed", default: "all")

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "ziakhan",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-07T10:00:00Z",
      "updated_at": "2025-12-07T10:00:00Z"
    }
  ]
}
```

#### POST /api/{user_id}/tasks
**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": "ziakhan",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-07T10:00:00Z",
  "updated_at": "2025-12-07T10:00:00Z"
}
```

#### GET /api/{user_id}/tasks/{id}
**Response:** Single task object

#### PUT /api/{user_id}/tasks/{id}
**Request Body:**
```json
{
  "title": "Buy groceries and fruits",
  "description": "Updated description"
}
```

**Response:** Updated task object

#### DELETE /api/{user_id}/tasks/{id}
**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

#### PATCH /api/{user_id}/tasks/{id}/complete
**Response:** Updated task object with toggled `completed` status

## Frontend Requirements

### Pages
1. **Home/Dashboard** (`/`)
   - List all tasks for logged-in user
   - Add task form
   - Filter controls (All/Pending/Completed)
   - Task list with checkboxes

2. **Login Page** (`/login`)
   - Email and password form
   - Better Auth integration

3. **Signup Page** (`/signup`)
   - Name, email, password form
   - Better Auth integration

4. **Task Edit Modal/Page**
   - Edit task form
   - Pre-populated with existing data

### Components
1. **TaskList** - Display tasks with status indicators
2. **TaskItem** - Single task row with actions
3. **TaskForm** - Create/edit task form
4. **AuthForm** - Login/signup form
5. **FilterControls** - Filter by status

## Technology Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| Frontend | Next.js 16+ (App Router) | Web UI framework |
| Language | TypeScript | Frontend type safety |
| Styling | Tailwind CSS | Styling utility |
| Backend | Python FastAPI | REST API server |
| ORM | SQLModel | Database ORM |
| Database | Neon Serverless PostgreSQL | Persistent storage |
| Authentication | Better Auth | User auth with JWT |
| Development | Claude Code, Spec-Kit Plus | Spec-driven development |

## Non-Functional Requirements

### NFR-1: Performance
- API response time: < 500ms for CRUD operations
- Frontend page load: < 2 seconds
- Support 100+ concurrent users

### NFR-2: Scalability
- Stateless API design
- Database connection pooling
- Horizontal scaling capability

### NFR-3: Security
- JWT tokens expire after 7 days
- Passwords hashed with bcrypt
- CORS properly configured
- Input validation on all endpoints

### NFR-4: Usability
- Responsive design (mobile-friendly)
- Clear error messages
- Loading states for async operations
- Intuitive UI with good UX

## Acceptance Criteria

### AC-1: User Authentication
- [ ] Users can register with email and password
- [ ] Users can login with valid credentials
- [ ] Invalid credentials show error message
- [ ] JWT token issued on successful login
- [ ] API rejects requests without valid token

### AC-2: Task Creation
- [ ] User can add task via web form
- [ ] Task saved to database
- [ ] Task associated with logged-in user
- [ ] Validation: title required (1-200 chars)
- [ ] Validation: description optional (0-1000 chars)

### AC-3: Task Listing
- [ ] User sees only their own tasks
- [ ] Tasks display with: title, description, status, date
- [ ] Completed tasks marked differently
- [ ] Can filter by status (all/pending/completed)
- [ ] Tasks sorted by creation date (newest first)

### AC-4: Task Update
- [ ] User can edit task details via web form
- [ ] Only task owner can update
- [ ] Changes saved to database
- [ ] Validation applies to updates

### AC-5: Task Deletion
- [ ] User can delete task via web interface
- [ ] Only task owner can delete
- [ ] Confirmation dialog before deletion
- [ ] Task removed from database

### AC-6: Task Completion Toggle
- [ ] User can mark task complete/incomplete with click
- [ ] Status updates immediately
- [ ] Visual indicator reflects status
- [ ] Database updated

### AC-7: API Endpoints
- [ ] All 6 endpoints implemented
- [ ] JWT authentication required
- [ ] User ownership enforced
- [ ] Consistent JSON responses
- [ ] Proper error handling (400, 401, 403, 404, 500)

### AC-8: Database Integration
- [ ] Connected to Neon PostgreSQL
- [ ] SQLModel migrations applied
- [ ] Data persists across restarts
- [ ] Multiple users supported (data isolation)

### AC-9: Frontend UI
- [ ] Dashboard page functional
- [ ] Login/signup pages functional
- [ ] Task forms work correctly
- [ ] Responsive design
- [ ] Better Auth integrated

### AC-10: Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (or accessible URL)
- [ ] Environment variables configured
- [ ] Demo video under 90 seconds

## Clarifications & Decisions

### CLR-001: Frontend State Management
**Decision**: React Server Components + useState for forms
**Rationale**: Best for Next.js 16+ App Router, optimized performance, simpler than external state management
**Implementation**:
- Server Components for data fetching (tasks, user info)
- Client Components with useState for forms (TaskForm, AuthForm)
- No external state library (Redux/Zustand) needed
- React Server Actions for mutations (add, update, delete task)

### CLR-002: Backend Structure
**Decision**: Modular structure with main.py as entry point
**Rationale**: Clean separation, easy to test, follows FastAPI best practices
**Implementation**:
- `main.py` - FastAPI app entry, middleware setup, route registration
- `app/config.py` - Configuration and environment variables
- `app/db.py` - Database connection and session management
- `app/models.py` - SQLModel database models
- `app/schemas.py` - Pydantic request/response schemas
- `app/auth.py` - JWT middleware and auth utilities
- `app/routes/tasks.py` - Task CRUD endpoints
- Future routes in `app/routes/` directory

### CLR-003: Database Migrations
**Decision**: Use Alembic for database migrations
**Rationale**: Industry standard, works with SQLModel, version control for schema changes
**Implementation**:
- Install alembic in requirements.txt
- Initialize: `alembic init alembic`
- Configure `alembic.ini` to use DATABASE_URL
- Create migration: `alembic revision --autogenerate -m "Initial schema"`
- Apply migration: `alembic upgrade head`
- Migration files in `backend/alembic/versions/`

### CLR-004: Error Handling Strategy
**Decision**: FastAPI built-in exception handling with custom error classes
**Rationale**: Consistent error responses, automatic HTTP status codes, user-friendly messages
**Implementation**:
- Use HTTPException for expected errors (401, 403, 404, 422)
- Custom exception classes for business logic errors
- Global exception handler for unexpected errors (500)
- All errors return JSON: `{"detail": "error message"}`

## Out of Scope

- Task priorities and tags (Phase V)
- Search functionality (Phase V)
- Due dates and reminders (Phase V)
- Multi-language support (Bonus)
- Voice commands (Bonus)
- Real-time updates (Phase V with Kafka)
- Advanced analytics

## Integration with Phase I

**Inherited from Phase I:**
- Task data model structure (id, title, description, completed, timestamps)
- Validation rules (title 1-200 chars, description 0-1000 chars)
- Business logic concepts

**New in Phase II:**
- `user_id` field for multi-user support
- Database persistence (Neon PostgreSQL)
- RESTful API (FastAPI)
- Web UI (Next.js)
- Authentication (Better Auth + JWT)
- User registration and login

## Preparation for Phase III

**Deliverables for Phase III:**
- Complete backend API with all CRUD endpoints
- Authentication system with JWT
- Database schema (Task model + Message model)
- MCP server architecture foundation
- Web frontend ready for chat integration

**Key Changes for Phase III:**
- Add Conversation and Message models
- Add `/api/{user_id}/chat` endpoint
- Integrate OpenAI Agents SDK
- Build MCP server with task tools
- Replace/add chat interface (ChatKit)

## Constraints

- Must use Spec-Driven Development
- No manual coding allowed
- Must use specified technology stack
- Must deploy to Vercel (frontend)
- Must use Neon PostgreSQL database
- Must implement Better Auth with JWT
- All endpoints require authentication

## Success Metrics

- All 5 Basic Level features implemented as web application
- Multi-user support with data isolation
- Persistent database storage
- Working authentication system
- Deployed application accessible via URL
- Demo video under 90 seconds
- Complete specification files

## Related Bonuses

- **Reusable Intelligence** (+200): Create Claude Code skills for API endpoint generation, database migration automation
- **Cloud-Native Blueprints**: Not applicable (deployment in Phase IV)

## API Authentication Flow

```
1. User registers/logs in on frontend (Better Auth)
   ↓
2. Better Auth issues JWT token
   ↓
3. Frontend stores token (secure storage)
   ↓
4. Frontend makes API request with token in Authorization header
   ↓
5. Backend validates JWT signature with shared secret
   ↓
6. Backend extracts user_id from token
   ↓
7. Backend validates user_id matches URL path
   ↓
8. Backend processes request and filters data for that user
   ↓
9. Backend returns response
```

## Environment Variables

### Frontend (Next.js)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<shared-secret>
DATABASE_URL=<neon-database-url>
```

### Backend (FastAPI)
```bash
DATABASE_URL=postgresql://user:password@host/db
BETTER_AUTH_SECRET=<shared-secret>
OPENAI_API_KEY=<optional-for-phase-3>
```

**Important**: `BETTER_AUTH_SECRET` must be the same for both frontend and backend for JWT verification.

## Testing Requirements

- Manual testing of all user workflows
- API testing with curl/Postman
- Test authentication flow
- Test user data isolation
- Test error handling

## Deployment Strategy

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings for Next.js
3. Set environment variables
4. Deploy automatically on push to main

### Backend (Render/Railway or similar)
1. Connect GitHub repository
2. Configure Python environment
3. Set environment variables
4. Deploy FastAPI application
5. Connect to Neon PostgreSQL

## Notes

- This is a critical phase - establishes the foundation for Phase III and beyond
- Focus on clean architecture to support future additions
- Document API endpoints thoroughly
- Test user data isolation thoroughly
- Prepare for migration to Phase III (chatbot integration)
