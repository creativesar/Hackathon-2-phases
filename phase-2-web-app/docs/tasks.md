# Phase II: Todo Full-Stack Web Application - Tasks

## Task Breakdown

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-201 | Set up monorepo structure | None | Completed [X] |
| T-202 | Initialize Next.js frontend | T-201 | Completed [X] |
| T-203 | Initialize FastAPI backend | T-201 | Completed [X] |
| T-204 | Create database models (SQLModel) | T-203 | Completed [X] |
| T-205 | Set up database connection | T-204 | Completed [X] |
| T-206 | Implement JWT authentication middleware | T-205 | Completed [X] |
| T-207 | Create task CRUD endpoints | T-206 | Completed [X] |
| T-208 | Implement Better Auth on frontend | T-202 | Completed [X] |
| T-209 | Create API client (lib/api.ts) | T-202 | Completed [X] |
| T-210 | Build TaskList component | T-209 | Completed [X] |
| T-211 | Build TaskItem component | T-210 | Completed [X] |
| T-212 | Build TaskForm component | T-210 | Completed [X] |
| T-213 | Build AuthForm components | T-208 | Completed [X] |
| T-214 | Create dashboard page | T-210 | Completed [X] |
| T-215 | Create login/signup pages | T-213 | Completed [X] |
| T-216 | Implement filter functionality | T-214 | Completed [X] |
| T-217 | Add error handling and loading states | T-216 | Completed [X] |
| T-218 | Set up environment variables | T-217 | Completed [X] |
| T-219 | Test authentication flow | T-218 | Completed [X] |
| T-220 | Test CRUD operations | T-219 | Completed [X] |
| T-221 | Deploy frontend to Vercel | T-220 | Pending |
| T-222 | Deploy backend (Hugging Face / Render / Railway) | T-221 | Pending |
| T-223 | Create comprehensive README | T-222 | Pending |
| T-224 | End-to-end testing | T-223 | Pending |

---

## Detailed Tasks

### T-201: Set up monorepo structure

**Priority**: High
**Related Spec**: Monorepo Structure
**Related Plan**: Monorepo Structure

**Steps**:
1. Create `frontend/` and `backend/` directories
2. Initialize Git if not already
3. Create `README.md` with project overview
4. Create `.gitignore` for both Python and Node
5. Set up root `CLAUDE.md` with instructions

**Outputs**: Monorepo structure created

---

### T-202: Initialize Next.js frontend

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Navigate to `frontend/`
2. Run: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir`
3. Install dependencies: `npm install`
4. Configure `tailwind.config.js`
5. Create `components/` and `lib/` directories

**Outputs**: Next.js app initialized

---

### T-203: Initialize FastAPI backend

**Priority**: High
**Related Spec**: Technology Stack

**Steps**:
1. Navigate to `backend/`
2. Run: `uv init`
3. Install dependencies:
   - `uv add fastapi uvicorn sqlmodel psycopg2-binary python-jose passlib[bcrypt]`
4. Create `app/` directory structure
5. Create `app/main.py` with basic FastAPI app

**Outputs**: FastAPI app initialized

---

### T-204: Create database models (SQLModel)

**Priority**: High
**Related Spec**: Data Models
**Related Plan**: Database Schema
**Phase I Reference**: `phase-1-console-app/src/models.py:15-45`

**Objective**: Evolve Phase I dataclass model into SQLModel with database persistence and multi-user support

**Steps**:
1. Create `backend/app/models.py`
2. **Import and reference Phase I model**:
   ```python
   # Reference: phase-1-console-app/src/models.py:15-45
   # Inheriting same structure and validation rules from Phase I
   ```
3. Define `Task` model with SQLModel (evolved from Phase I):
   - Copy same fields from Phase I: id, title, description, completed, created_at, updated_at
   - Add NEW field: `user_id` (Foreign key to users.id) for multi-user support
   - Implement same validation: title 1-200, description 0-1000 characters
   - Use SQLModel Field constraints instead of `__post_init__` validation
4. Define `Message` model (for Phase III preparation)
5. Add proper indexes and constraints (idx_tasks_user_id, idx_tasks_completed)
6. Add validation rules via SQLModel Field constraints

**Phase I → Phase II Mapping**:
| Phase I Field | Phase II Field | Notes |
|---------------|----------------|--------|
| `id: int` | `id: int | None` | SQLModel auto-increment |
| `title: str` | `title: str` | Same, validated via Field |
| `description: str` | `description: str | None` | Same, optional |
| `completed: bool` | `completed: bool` | Same, default False |
| `created_at: datetime` | `created_at: datetime` | Same, Field factory |
| `updated_at: datetime` | `updated_at: datetime` | Same, Field factory |
| — | `user_id: str` | **NEW**: For multi-user support |

**Validation Rules (Inherited from Phase I)**:
- Title: 1-200 characters (required) - same as Phase I `__post_init__` validation
- Description: 0-1000 characters (optional) - same as Phase I validation

**Outputs**: Database models defined, evolution from Phase I documented

