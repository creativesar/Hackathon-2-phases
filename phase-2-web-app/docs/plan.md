# Phase II: Todo Full-Stack Web Application - Plan

## Architecture Overview
Full-stack web application with monorepo structure. Frontend (Next.js) communicates with backend (FastAPI) via REST API. Backend uses Neon PostgreSQL for persistence with Better Auth handling user authentication.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Web Browser                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Frontend - Next.js 16+ (App Router)        │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │     Better Auth (JWT Token Management)          │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │  Components: TaskList, TaskForm, AuthForm      │  │   │
│  │  │  Pages: /, /login, /signup                │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │ HTTP (JWT Token)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend - FastAPI (Python)                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         JWT Middleware (Token Verification)            │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         API Routes (/api/{user_id}/tasks)             │  │
│  │  - GET, POST, PUT, DELETE, PATCH endpoints          │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         Services (Business Logic)                      │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         SQLModel ORM                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │ psycopg2
                           ▼
              ┌─────────────────────────┐
              │  Neon PostgreSQL      │
              │  - tasks table        │
              │  - users table        │
              └─────────────────────────┘
```

## Technology Stack

### Frontend Stack
| Component | Technology | Version |
|-----------|-------------|----------|
| Framework | Next.js | 16+ (App Router) |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| Authentication | Better Auth | Latest |
| HTTP Client | fetch / axios | Latest |

### Backend Stack
| Component | Technology | Version |
|-----------|-------------|----------|
| Framework | FastAPI | 0.104+ |
| Language | Python | 3.13+ |
| ORM | SQLModel | 0.0.14+ |
| Database | Neon PostgreSQL | Serverless |
| Auth | JWT (python-jose) | Latest |
| Server | uvicorn | 0.30+ |

### DevOps
| Component | Technology |
|-----------|-------------|
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Render/Railway |
| Database | Neon Serverless |
| Package Manager | UV (Python), npm (Node) |
| Spec Management | Spec-Kit Plus |

## Monorepo Structure

```
phase-2-web-app/
├── frontend/                    # Next.js Application
│   ├── app/                    # App Router
│   │   ├── (auth)/            # Auth group layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── api/                # API routes (if needed)
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
├── backend/                     # FastAPI Application
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
├── docs/                       # Documentation
│   ├── spec.md               # Requirements
│   ├── plan.md               # This file
│   └── tasks.md             # Implementation tasks
│
└── README.md                 # Setup instructions
```

## Database Schema

### users Table (Managed by Better Auth)
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

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

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, completed);
```

## API Design

### JWT Authentication Flow

1. **User Registration/Login (Frontend - Better Auth)**
   ```
   User fills signup/login form
     ↓
   Frontend calls Better Auth API
     ↓
   Better Auth creates session & JWT token
     ↓
   Frontend stores token in localStorage/cookie
     ↓
   Frontend redirects to dashboard
   ```

2. **API Request Flow**
   ```
   Frontend makes API request
     ↓
   Include JWT in header: Authorization: Bearer <token>
     ↓
   Backend receives request
     ↓
   JWT Middleware extracts and verifies token
     ↓
   Extract user_id from token
     ↓
   Validate user_id matches URL path
     ↓
   Route to endpoint handler
     ↓
   Filter data by user_id
     ↓
   Return response
   ```

### RESTful API Patterns

**URL Pattern:** `/api/{user_id}/tasks`

**Resource Hierarchy:**
```
/api/{user_id}/tasks           # Collection of tasks
/api/{user_id}/tasks/{id}     # Specific task
/api/{user_id}/tasks/{id}/complete  # Action on task
```

**Request/Response Format:**

Standard Success Response:
```json
{
  "data": { /* task object or array */ }
}
```

Standard Error Response:
```json
{
  "detail": "Error message",
  "status": 400
}
```

## Frontend Architecture

### Component Hierarchy

```
Layout (app/layout.tsx)
├── AuthProvider (wrap with Better Auth)
└── Page Components
    ├── LoginPage (/login)
    ├── SignupPage (/signup)
    └── DashboardPage (/)
        ├── FilterControls
        ├── TaskForm (add new)
        └── TaskList
            └── TaskItem[]
                ├── Checkbox (toggle complete)
                ├── EditButton
                └── DeleteButton
```

### State Management
- **Server State**: React Server Components fetch data directly
- **Client State**: React useState for forms, mutations
- **Auth State**: Better Auth session management
- **Optimization**: React caching for API responses

### API Client (`lib/api.ts`)

```typescript
class TodoAPIClient {
  private baseURL: string;

  constructor(token: string) {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async getTasks(userId: string, status?: string): Promise<Task[]>
  async createTask(userId: string, task: TaskCreate): Promise<Task>
  async updateTask(userId: string, id: number, task: TaskUpdate): Promise<Task>
  async deleteTask(userId: string, id: number): Promise<void>
  async toggleComplete(userId: string, id: number): Promise<Task>
}
```

## Backend Architecture

### Application Structure

```python
# main.py
app = FastAPI()

# Middleware
app.add_middleware(CORSMiddleware)
app.add_middleware(JWTAuthMiddleware)

# Routes
app.include_router(tasks_router, prefix="/api/{user_id}/tasks")

# Database
init_db()

# Start server
uvicorn.run(app)
```

### Service Layer Pattern

```
Controller (routes/tasks.py)
    ↓ calls
Service (services/task_service.py)
    ↓ uses
Repository (db.py - SQLModel)
    ↓ interacts with
Database (Neon PostgreSQL)
```

## Security Architecture

### JWT Implementation

**Token Structure:**
```python
{
  "sub": "user_id",           # Subject (user ID)
  "email": "user@example.com",
  "iat": 1234567890,         # Issued at
  "exp": 1235172890          # Expiration (7 days)
}
```

**Shared Secret:**
```
Frontend (Better Auth) → JWT signing
Backend (FastAPI)     → JWT verification

Both use same BETTER_AUTH_SECRET environment variable
```

### Authorization Flow

```python
# Middleware (auth.py)
def jwt_middleware(request):
    token = request.headers.get("Authorization")

    if not token:
        raise HTTPException(401, "No token provided")

    # Verify token
    try:
        payload = decode_jwt(token.replace("Bearer ", ""), SECRET)
    except:
        raise HTTPException(401, "Invalid token")

    # Extract user_id
    user_id = payload.get("sub")

    # Validate against URL path
    path_user_id = request.path_params.get("user_id")
    if user_id != path_user_id:
        raise HTTPException(403, "Access denied")

    # Attach to request state
    request.state.user_id = user_id
```

### Data Isolation Strategy

**All database queries filter by user_id:**

```python
# Example: Get tasks
def get_tasks(user_id: str, db: Session):
    return db.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

# Never allow querying without user_id filter!
```

## Error Handling

### Error Taxonomy

| HTTP Code | Scenario | Response |
|-----------|-----------|-----------|
| 400 | Validation error | {"detail": "Invalid input"} |
| 401 | Missing/invalid token | {"detail": "Unauthorized"} |
| 403 | Wrong user accessing data | {"detail": "Forbidden"} |
| 404 | Resource not found | {"detail": "Task not found"} |
| 500 | Server error | {"detail": "Internal server error"} |

### Exception Handling Pattern

```python
try:
    result = create_task(...)
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    raise HTTPException(status_code=500, detail="Server error")
```

## Performance Considerations

### Database Optimization
- Indexes on `user_id` and `completed` columns
- Connection pooling (SQLModel/psycopg2)
- Prepared statements (ORM handles)

### API Optimization
- Async endpoints (FastAPI native)
- Response compression (gzip)
- CORS caching headers

### Frontend Optimization
- Next.js SSR/ISR where possible
- Image optimization (Next.js Image component)
- Lazy loading components
- Debounce search/filter inputs

## Deployment Architecture

### Frontend (Vercel)
```
Git Push → GitHub
    ↓
Vercel Auto-Deploy
    ↓
Build Next.js App
    ↓
Deploy to Edge Network
    ↓
URL: https://your-app.vercel.app
```

### Backend (Render/Railway)
```
Git Push → GitHub
    ↓
Render/Railway Auto-Deploy
    ↓
Build Python App
    ↓
Deploy to Cloud VM
    ↓
URL: https://your-api.onrender.com
```

### Database (Neon)
```
Neon Serverless
    ↓
Auto-scaling compute
    ↓
Storage in regions
    ↓
Connection via DATABASE_URL
```

## Development Workflow

### Local Development

```bash
# Terminal 1: Backend
cd backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv sync
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Testing Workflow

1. **Backend API Testing**
   ```bash
   curl -X POST http://localhost:8000/api/{user_id}/tasks \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test task"}'
   ```

2. **Frontend Manual Testing**
   - Navigate to http://localhost:3000
   - Test signup/login flow
   - Test all CRUD operations
   - Test authentication

## Migration from Phase I

### What Changes
- **Data Storage**: In-memory → PostgreSQL
- **User Interface**: CLI → Web UI
- **Architecture**: Single-process → Client-Server
- **Auth**: None → JWT + Better Auth
- **Multi-user**: No → Yes

### What Stays Same
- **Task Model Structure**: Same attributes
- **Validation Rules**: Same limits (title 1-200, description 0-1000)
- **Business Logic**: Same concepts (CRUD operations)
- **Status Management**: Same completion toggle

### Data Migration
```python
# Phase I Task model
class Task:
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime

# Phase II Task model (SQLModel)
class Task(SQLModel, table=True):
    id: int
    user_id: str        # NEW
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime
```

## Preparation for Phase III

### Foundation for Chatbot
- **Database**: Add `conversations` and `messages` tables
- **API**: Add `/api/{user_id}/chat` endpoint
- **Backend**: Prepare for OpenAI Agents SDK integration
- **Frontend**: Prepare for ChatKit integration

### MCP Server Foundation
- **Tool Structure**: Task operations already modular (service layer)
- **Statelessness**: Current API design is stateless
- **Database Ready**: Message model prepared

## Decision Records

### DR-001: Better Auth vs Custom Auth
**Decision**: Use Better Auth
**Rationale**:
- Built-in session management
- JWT token support out of the box
- Social login ready (future)
- Next.js native integration
- Security best practices handled

**Trade-offs**:
- Learning curve for Better Auth
- Slightly more complex than simple JWT

### DR-002: Monorepo vs Separate Repos
**Decision**: Use monorepo
**Rationale**:
- Single CLAUDE.md context for Claude Code
- Easier cross-cutting changes
- Simpler for hackathon submission
- Shared documentation

**Trade-offs**:
- Larger repository
- Independent deployment requires careful CI/CD

### DR-003: SQLModel vs SQLAlchemy
**Decision**: Use SQLModel
**Rationale**:
- Pydantic integration (same as FastAPI)
- Automatic schema generation
- Type safety
- Modern and maintained
- Recommended by FastAPI

**Trade-offs**:
- Less mature than SQLAlchemy
- Fewer community resources

### DR-004: UUID vs String user_id
**Decision**: Use string user_id from Better Auth
**Rationale**:
- Better Auth uses string IDs
- Maintain consistency with auth system
- No need to convert

**Trade-offs**:
- Slightly larger than integer
- Not as performant as integer

## Risk Analysis

### Risk 1: JWT Secret Exposure
**Likelihood**: Low
**Impact**: High (security breach)
**Mitigation**:
- Store in environment variables
- Never commit to Git
- Use strong secrets
- Rotate periodically

### Risk 2: Database Connection Exhaustion
**Likelihood**: Medium
**Impact**: High (app unavailable)
**Mitigation**:
- Use connection pooling
- Set connection limits
- Monitor database metrics

### Risk 3: CORS Issues
**Likelihood**: High (common dev issue)
**Impact**: Medium (frontend can't access API)
**Mitigation**:
- Proper CORS configuration
- Test in development environment
- Document deployment URLs

## Success Criteria

- [ ] All 5 Basic Level features as web app
- [ ] Multi-user support with data isolation
- [ ] JWT authentication working
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed and accessible
- [ ] Database connected and persisting data
- [ ] Demo video under 90 seconds

## Clarifications & Decisions

### CLR-001: Monorepo Directory Layout
**Decision**: Single directory with frontend/ and backend/ subdirectories
**Rationale**: Clear separation, easier to navigate, standard for monorepos
**Implementation**:
```
phase-2-web-app/
├── frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── db.py
│   │   ├── auth.py
│   │   └── routes/
│   ├── tests/
│   └── pyproject.toml
└── README.md
```

### CLR-002: CORS Configuration
**Decision**: Allow all origins in development, restrict to Vercel domain in production
**Rationale**: Secure for production, flexible for development
**Implementation**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development
    # allow_origins=["https://your-app.vercel.app"],  # Production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### CLR-003: Database Connection Strategy
**Decision**: Single connection pool with session management
**Rationale**: Efficient resource usage, connection reuse, prevents connection exhaustion
**Implementation**:
- Use SQLModel's Session factory with engine
- Dependency injection for request-scoped sessions
- Automatic cleanup after request
- Connection pooling configured in `db.py`

### CLR-004: Deployment Order
**Decision**: Deploy backend first, then frontend
**Rationale**: Backend URL needed for frontend configuration, simpler to verify backend working
**Implementation**:
1. Deploy backend (get production URL)
2. Add backend URL to frontend environment variables
3. Deploy frontend (auto-configures to use backend URL)
4. Test end-to-end

## Next Steps

1. Set up monorepo structure
2. Initialize Next.js frontend
3. Initialize FastAPI backend
4. Implement database models
5. Create API endpoints
6. Build frontend UI
7. Integrate authentication
8. Test end-to-end
9. Deploy to production
10. Prepare for Phase III
