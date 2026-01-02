---
id: 007
title: Create task CRUD endpoints
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["backend", "api", "crud", "rest", "endpoints"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/backend/app/schemas.py
  - phase-2-web-app/backend/app/routes/tasks.py
  - phase-2-web-app/backend/app/main.py
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: All routes registered correctly
  - Manual verification: CRUD operations work with database
  - Manual verification: Foreign key constraint enforced
---

## Prompt

T-207: Task CRUD endpoints (backend)

## Response snapshot

Successfully implemented Task T-207 (Create task CRUD endpoints) by:

1. **Created Pydantic Schemas** (`backend/app/schemas.py`):

   **Request Schemas**:
   - `TaskCreate`: For POST /api/{user_id}/tasks
     - title: str (1-200 characters, required)
     - description: Optional[str] (0-1000 characters)

   - `TaskUpdate`: For PUT /api/{user_id}/tasks/{id}
     - All fields optional (partial updates)
     - title, description, completed

   - `TaskCompletionToggle`: For PATCH /api/{user_id}/tasks/{id}/complete
     - completed: bool (toggle status)

   **Response Schemas**:
   - `TaskResponse`: Single task response
     - All task fields including timestamps
     - ORM mode enabled for SQLModel compatibility

   - `TaskListResponse`: Task collection response
     - tasks: list[TaskResponse]
     - count: int (total count)

   - `MessageResponse`: Success/deletion messages
     - message: str
     - task_id: Optional[int]

2. **Implemented CRUD Endpoints** (`backend/app/routes/tasks.py`):

   **GET /api/{user_id}/tasks** - List tasks with filtering
   - Query param: `status` (all/pending/completed)
   - Returns: TaskListResponse with count
   - Order: created_at descending (newest first)
   - Authentication: verify_user_access dependency
   - Data isolation: Filters by verified_user_id

   **POST /api/{user_id}/tasks** - Create new task
   - Request: TaskCreate schema
   - Returns: TaskResponse (201 Created)
   - Sets user_id from JWT token
   - Auto-generates timestamps
   - Authentication: verify_user_access dependency

   **GET /api/{user_id}/tasks/{task_id}** - Get single task
   - Path param: task_id
   - Returns: TaskResponse
   - Raises 404 if not found or wrong user
   - Authentication: verify_user_access dependency

   **PUT /api/{user_id}/tasks/{task_id}** - Update task
   - Request: TaskUpdate schema (partial)
   - Returns: TaskResponse
   - Updates only provided fields
   - Updates updated_at timestamp
   - Raises 404 if not found
   - Authentication: verify_user_access dependency

   **DELETE /api/{user_id}/tasks/{task_id}** - Delete task
   - Returns: MessageResponse with task_id
   - Raises 404 if not found
   - Authentication: verify_user_access dependency

   **PATCH /api/{user_id}/tasks/{task_id}/complete** - Toggle completion
   - Request: TaskCompletionToggle schema
   - Returns: TaskResponse
   - Updates completed field and timestamp
   - Raises 404 if not found
   - Authentication: verify_user_access dependency

3. **Security Features**:
   - All endpoints require JWT authentication
   - `verify_user_access` dependency on every route
   - Ensures user_id in URL matches JWT token (403 if mismatch)
   - Database queries filter by verified_user_id (data isolation)
   - Foreign key constraint enforces user existence

4. **Registered Routes** (`backend/app/main.py`):
   - Imported task router
   - Registered with `app.include_router(tasks.router)`
   - Routes available at `/api/{user_id}/tasks` prefix
   - Appears in OpenAPI docs (/docs)

5. **API Endpoints Registered**:
   ```
   GET    /api/{user_id}/tasks                    # List tasks
   POST   /api/{user_id}/tasks                    # Create task
   GET    /api/{user_id}/tasks/{task_id}          # Get task
   PUT    /api/{user_id}/tasks/{task_id}          # Update task
   DELETE /api/{user_id}/tasks/{task_id}          # Delete task
   PATCH  /api/{user_id}/tasks/{task_id}/complete # Toggle completion
   ```

6. **Tested Implementation**:
   - Created test user in database
   - Created task successfully
   - Listed tasks (count correct)
   - Updated task completion status
   - Deleted task
   - Foreign key constraint validated (requires user to exist)
   - All CRUD operations successful

7. **Data Isolation Verified**:
   - All queries filter by `verified_user_id` from JWT
   - Users cannot access other users' tasks
   - URL path `user_id` must match JWT token `sub` claim
   - 403 Forbidden if attempting to access other user's resources

8. **Updated tasks.md** - Marked T-207 as Completed [X]

The task CRUD API is now complete with full authentication, authorization, and data isolation.

## Outcome

- ✅ Impact: Complete RESTful API for task management with security
- 🧪 Tests: Manual verification passed (CRUD operations, authentication, data isolation)
- 📁 Files: 3 files created/modified (schemas.py, routes/tasks.py, main.py)
- 🔁 Next prompts: T-208 (Implement Better Auth on frontend)
- 🧠 Reflection: Clean separation of concerns with Pydantic schemas for API contracts and SQLModel for database. FastAPI dependency injection provides elegant authentication.

## Evaluation notes (flywheel)

- Failure modes observed: Foreign key constraint requires user to exist (expected behavior)
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
