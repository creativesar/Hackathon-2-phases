# Phase II: Todo Full-Stack Web Application - Tasks

## Task Breakdown

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-201 | Set up monorepo structure | None | Pending |
| T-202 | Initialize Next.js frontend | T-201 | Pending |
| T-203 | Initialize FastAPI backend | T-201 | Pending |
| T-204 | Create database models (SQLModel) | T-203 | Pending |
| T-205 | Set up database connection | T-204 | Pending |
| T-206 | Implement JWT authentication middleware | T-205 | Pending |
| T-207 | Create task CRUD endpoints | T-206 | Pending |
| T-208 | Implement Better Auth on frontend | T-202 | Pending |
| T-209 | Create API client (lib/api.ts) | T-202 | Pending |
| T-210 | Build TaskList component | T-209 | Pending |
| T-211 | Build TaskItem component | T-210 | Pending |
| T-212 | Build TaskForm component | T-210 | Pending |
| T-213 | Build AuthForm components | T-208 | Pending |
| T-214 | Create dashboard page | T-210 | Pending |
| T-215 | Create login/signup pages | T-213 | Pending |
| T-216 | Implement filter functionality | T-214 | Pending |
| T-217 | Add error handling and loading states | T-216 | Pending |
| T-218 | Set up environment variables | T-217 | Pending |
| T-219 | Test authentication flow | T-218 | Pending |
| T-220 | Test CRUD operations | T-219 | Pending |
| T-221 | Deploy frontend to Vercel | T-220 | Pending |
| T-222 | Deploy backend to Render/Railway | T-221 | Pending |
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

**Steps**:
1. Create `app/models.py`
2. Define `Task` model with SQLModel
3. Define `Message` model (for Phase III)
4. Add proper indexes and constraints
5. Add validation rules (title 1-200, description 0-1000)

**Outputs**: Database models defined

---

### T-205: Set up database connection

**Priority**: High
**Related Spec**: Database Persistence

**Steps**:
1. Create `app/db.py`
2. Create Neon PostgreSQL account
3. Get `DATABASE_URL`
4. Implement `create_db_and_tables()`
5. Implement `get_session()` for connection pooling
6. Test database connection

**Outputs**: Database connected

---

### T-206: Implement JWT authentication middleware

**Priority**: High
**Related Spec**: API Authentication

**Steps**:
1. Create `app/auth.py`
2. Implement JWT encode/decode functions
3. Create `JWTAuthMiddleware` class
4. Add token extraction from Authorization header
5. Add user validation (token user_id matches path user_id)
6. Add middleware to FastAPI app

**Outputs**: JWT authentication working

---

### T-207: Create task CRUD endpoints

**Priority**: High
**Related Spec**: API Endpoints

**Steps**:
1. Create `app/routes/tasks.py`
2. Create Pydantic schemas (TaskCreate, TaskUpdate, TaskRead)
3. Implement `GET /api/{user_id}/tasks` with status filter
4. Implement `POST /api/{user_id}/tasks`
5. Implement `GET /api/{user_id}/tasks/{id}`
6. Implement `PUT /api/{user_id}/tasks/{id}`
7. Implement `DELETE /api/{user_id}/tasks/{id}`
8. Implement `PATCH /api/{user_id}/tasks/{id}/complete`
9. Add error handling and validation

**Outputs**: All CRUD endpoints working

---

### T-208: Implement Better Auth on frontend

**Priority**: High
**Related Spec**: User Authentication

**Steps**:
1. Install Better Auth: `npm install better-auth`
2. Configure Better Auth in `lib/auth.ts`
3. Set up JWT plugin
4. Configure `BETTER_AUTH_SECRET`
5. Create auth context provider
6. Add signup/login forms integration

**Outputs**: Better Auth configured

---

### T-209: Create API client (lib/api.ts)

**Priority**: High
**Related Spec**: Frontend Architecture

**Steps**:
1. Create `lib/api.ts`
2. Define TypeScript interfaces (Task, TaskCreate, TaskUpdate)
3. Create `TodoAPIClient` class
4. Implement `getTasks(userId, status?)`
5. Implement `createTask(userId, task)`
6. Implement `updateTask(userId, id, task)`
7. Implement `deleteTask(userId, id)`
8. Implement `toggleComplete(userId, id)`
9. Add error handling and retry logic

**Outputs**: API client created

---

### T-210: Build TaskList component

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `components/TaskList.tsx`
2. Accept tasks array as prop
3. Display tasks in formatted list
4. Show completion indicators (✓/✗)
5. Show task details (title, description, date)
6. Handle empty state

**Outputs**: TaskList component

---

### T-211: Build TaskItem component

**Priority**: Medium
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `components/TaskItem.tsx`
2. Accept task object as prop
3. Display task with checkbox
4. Add Edit button
5. Add Delete button
6. Implement toggle complete action
7. Implement delete action with confirmation
8. Style with Tailwind

**Outputs**: TaskItem component

---

### T-212: Build TaskForm component

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `components/TaskForm.tsx`
2. Create form with title and description fields
3. Add validation (title required, 1-200 chars)
4. Handle form submission
5. Clear form after submit
6. Show loading state during API call
7. Show success/error messages

**Outputs**: TaskForm component

---

### T-213: Build AuthForm components

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `components/AuthForm.tsx` (shared)
2. Create login-specific form fields
3. Create signup-specific form fields (name, email, password)
4. Add validation
5. Integrate with Better Auth
6. Handle success (redirect to dashboard)
7. Handle errors (show message)

**Outputs**: AuthForm components

---

### T-214: Create dashboard page

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `app/page.tsx` (dashboard)
2. Fetch tasks on load (use API client)
3. Display TaskList
4. Display TaskForm for adding tasks
5. Add FilterControls
6. Handle task updates (optimistic UI updates)
7. Show error messages
8. Check authentication (redirect if not logged in)

**Outputs**: Dashboard page functional

---

### T-215: Create login/signup pages

**Priority**: High
**Related Spec**: Frontend Requirements

**Steps**:
1. Create `app/login/page.tsx`
2. Create `app/signup/page.tsx`
3. Render AuthForm components
4. Handle successful auth (redirect)
5. Handle errors (show message)
6. Add link between login/signup pages

**Outputs**: Auth pages functional

---

### T-216: Implement filter functionality

**Priority**: Medium
**Related Spec**: FR-7

**Steps**:
1. Create `components/FilterControls.tsx`
2. Add filter buttons (All, Pending, Completed)
3. Pass filter to API client
4. Update dashboard to use filtered tasks
5. Update UI to show active filter

**Outputs**: Filter functionality working

---

### T-217: Add error handling and loading states

**Priority**: Medium
**Related Spec**: NFR-1, NFR-4

**Steps**:
1. Add loading spinners to async operations
2. Add error boundaries
3. Show user-friendly error messages
4. Implement retry logic for API failures
5. Add form validation errors

**Outputs**: Robust error handling

---

### T-218: Set up environment variables

**Priority**: High
**Related Spec**: Environment Variables

**Steps**:
1. Create `.env.example` with all variables
2. Create `.env.local` for frontend
3. Create `.env` for backend
4. Configure `BETTER_AUTH_SECRET` (same for both)
5. Configure `DATABASE_URL` (Neon)
6. Configure `NEXT_PUBLIC_API_URL`
7. Document environment setup in README

**Outputs**: Environment configured

---

### T-219: Test authentication flow

**Priority**: High
**Related Spec**: AC-1

**Steps**:
1. Test user signup
2. Verify JWT token issued
3. Test user login
4. Test invalid credentials
5. Test token expiration
6. Test protected API access

**Outputs**: Authentication tested

---

### T-220: Test CRUD operations

**Priority**: High
**Related Spec**: AC-2-AC-6

**Steps**:
1. Test create task
2. Test list tasks
3. Test update task
4. Test delete task
5. Test toggle completion
6. Test user data isolation
7. Test validation errors

**Outputs**: CRUD operations tested

---

### T-221: Deploy frontend to Vercel

**Priority**: High
**Related Spec**: AC-10

**Steps**:
1. Connect GitHub repo to Vercel
2. Configure build settings
3. Add environment variables
4. Deploy
5. Test deployed app
6. Get production URL

**Outputs**: Frontend deployed

---

### T-222: Deploy backend to Render/Railway

**Priority**: High
**Related Spec**: AC-10

**Steps**:
1. Connect GitHub repo to Render/Railway
2. Configure Python environment
3. Add environment variables
4. Deploy
5. Test deployed API
6. Get production URL

**Outputs**: Backend deployed

---

### T-223: Create comprehensive README

**Priority**: Medium
**Related Spec**: Success Criteria

**Steps**:
1. Create project overview
2. List prerequisites
3. Add installation steps
4. Add environment variable setup
5. Add running instructions
6. Add deployment links
7. Add API documentation
8. Add feature list

**Outputs**: Complete README

---

### T-224: End-to-end testing

**Priority**: High
**Related Spec**: Success Criteria

**Steps**:
1. Test full user journey from signup to task management
2. Test all CRUD operations end-to-end
3. Test authentication flow
4. Test error handling
5. Test responsive design
6. Record demo video (under 90 seconds)
7. Fix any bugs found

**Outputs**: Testing complete, demo ready

---

## Task Dependencies

```
T-201 (Setup)
  ├─→ T-202 (Frontend Init)
  │     ├─→ T-208 (Better Auth)
  │     │     └─→ T-213 (Auth Forms)
  │     │           └─→ T-215 (Auth Pages)
  │     └─→ T-209 (API Client)
  │           └─→ T-210 (TaskList)
  │                 ├─→ T-211 (TaskItem)
  │                 ├─→ T-212 (TaskForm)
  │                 └─→ T-214 (Dashboard)
  │                       └─→ T-216 (Filters)
  │                             └─→ T-217 (Error Handling)
  │
  ├─→ T-203 (Backend Init)
  │     └─→ T-204 (DB Models)
  │           └─→ T-205 (DB Connection)
  │                 └─→ T-206 (JWT Auth)
  │                       └─→ T-207 (API Endpoints)
  │
  T-217 ──→ T-218 (Environment)
           ├─→ T-219 (Test Auth)
           └─→ T-220 (Test CRUD)
                 ├─→ T-221 (Deploy Frontend)
                 └─→ T-222 (Deploy Backend)
                       ├─→ T-223 (README)
                       └─→ T-224 (E2E Testing)
```

## Progress Checklist

- [ ] Monorepo structure
- [ ] Next.js frontend initialized
- [ ] FastAPI backend initialized
- [ ] Database models created
- [ ] Database connected
- [ ] JWT authentication
- [ ] API endpoints
- [ ] Better Auth configured
- [ ] API client created
- [ ] UI components built
- [ ] Pages created
- [ ] Error handling
- [ ] Environment configured
- [ ] Authentication tested
- [ ] CRUD tested
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Documentation complete
- [ ] E2E testing done

## Notes

- Total estimated time: 8-10 hours
- Use Claude Code for all implementation
- Test user data isolation thoroughly
- Prepare database schema for Phase III
- Demo video must be under 90 seconds
