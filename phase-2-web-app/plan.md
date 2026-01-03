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
| Deployment (Backend) | Hugging Face Spaces / Render / Railway |
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

### Backend (Choose One)

#### Option 1: Hugging Face Spaces (Recommended for Free Tier)
```
Git Push → GitHub → Hugging Face Space
    ↓
Auto-Deploy FastAPI App
    ↓
Build Python Environment
    ↓
Deploy to HF Inference
    ↓
URL: https://username-todo-backend.hf.space
```

**Pros:**
- Free tier with good resources
- Easy FastAPI deployment
- Built-in authentication
- Good for AI/ML apps

**Setup:**
1. Create Space on Hugging Face
2. Choose "Docker" SDK
3. Add Dockerfile for FastAPI
4. Connect GitHub repo
5. Set environment variables (DATABASE_URL, BETTER_AUTH_SECRET)

#### Option 2: Render
```
Git Push → GitHub
    ↓
Render Auto-Deploy
    ↓
Build Python App
    ↓
Deploy to Cloud VM
    ↓
URL: https://your-api.onrender.com
```

**Pros:**
- Free tier available
- Auto SSL certificates
- Easy configuration
- Good docs

**Cons:**
- Free tier spins down after inactivity
- Slower cold starts

#### Option 3: Railway
```
Git Push → GitHub
    ↓
Railway Auto-Deploy
    ↓
Build Python App
    ↓
Deploy to Railway Cloud
    ↓
URL: https://your-api.up.railway.app
```

**Pros:**
- $5 free credits monthly
- Fast deployments
- Modern UI
- Good DX

**Cons:**
- Requires credit card
- Credits expire monthly

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


### Data Migration & Model Evolution

**Phase I Reference**: `phase-1-console-app/src/models.py`

**Phase I Task Model (dataclass - In-Memory Storage):**
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
        if not self.title or len(self.title) < 1:
            raise ValueError("Title must be at least 1 character")
        if len(self.title) > 200:
            raise ValueError("Title cannot exceed 200 characters")
        if len(self.description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")
```

**Phase II Task Model (SQLModel - Persistent Database with Multi-User Support):**
```python
# Evolved from Phase I with user_id for multi-user support
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str        # NEW: Foreign key to users.id for multi-user support
    title: str          # Inherited: 1-200 chars (validated via Field constraints)
    description: str | None = None  # Inherited: 0-1000 chars
    completed: bool = Field(default=False)  # Inherited
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
    updated_at: datetime = Field(default_factory=datetime.utcnow)  # Inherited
```

**Evolution Summary:**
| Aspect | Phase I | Phase II |
|--------|----------|----------|
| **Model Type** | Python `@dataclass` | `SQLModel(table=True)` |
| **Storage** | In-memory (dict/list) | Neon PostgreSQL (persistent) |
| **Validation** | `__post_init__` method | SQLModel Field constraints + Pydantic |
| **User Support** | Single user | Multi-user via `user_id` field |
| **Persistence** | Lost on restart | Persistent across restarts |
| **Access Pattern** | Direct method calls | REST API endpoints |

**What's Inherited from Phase I:**
- ✓ Task structure (id, title, description, completed, timestamps)
- ✓ Validation rules (title 1-200, description 0-1000 characters)
- ✓ Business logic concepts (CRUD operations)
- ✓ Status management (complete/incomplete toggle)

**What's New in Phase II:**
- ➕ `user_id` field for multi-user data isolation
- ➕ Database persistence via SQLModel
- ➕ RESTful API endpoints
- ➕ JWT authentication
- ➕ User registration and login

