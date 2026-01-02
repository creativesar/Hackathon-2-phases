---
id: 009
title: Create API client
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["frontend", "api-client", "typescript", "http", "crud"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/frontend/lib/api.ts
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: TypeScript interfaces match backend schemas
  - Manual verification: All CRUD methods implemented
  - Manual verification: Type safety and error handling added
---

## Prompt

T-209: Create API client (lib/api.ts)

## Response snapshot

Successfully implemented Task T-209 (Create API client) by:

1. **Created TypeScript Type Definitions**:

   **Task Types** (matching backend Pydantic schemas):
   - `Task`: Complete task object with all fields
   - `TaskCreate`: Create payload (title, description)
   - `TaskUpdate`: Update payload (partial, all fields optional)
   - `TaskListResponse`: List response with tasks array and count
   - `TaskCompletionToggle`: Completion toggle payload
   - `MessageResponse`: Success message response
   - `APIError`: Error response structure

   **Helper Types**:
   - `TaskStatus`: Union type for "all" | "pending" | "completed"

2. **Created TodoAPIClient Class**:

   **Constructor**:
   - Gets `NEXT_PUBLIC_API_URL` from environment
   - Defaults to http://localhost:8000 if not set

   **Private Methods**:
   - `request<T>()`: Generic HTTP request method
     - Automatically adds JWT token from session
     - Sets Content-Type: application/json
     - Handles error responses
     - Type-safe response parsing

3. **Implemented CRUD Methods**:

   **GET /api/{user_id}/tasks** - `getTasks(userId, status)`
   - Lists all tasks with optional filtering
   - Query param: status ("all", "pending", "completed")
   - Returns: TaskListResponse with tasks array and count
   - Type signature: `Promise<TaskListResponse>`

   **GET /api/{user_id}/tasks/{id}** - `getTask(userId, taskId)`
   - Gets single task by ID
   - Returns: Task object
   - Type signature: `Promise<Task>`

   **POST /api/{user_id}/tasks** - `createTask(userId, task)`
   - Creates new task
   - Accepts: TaskCreate (title, description)
   - Returns: Created Task object
   - Type signature: `Promise<Task>`

   **PUT /api/{user_id}/tasks/{id}** - `updateTask(userId, taskId, updates)`
   - Updates existing task (partial update)
   - Accepts: TaskUpdate (title?, description?, completed?)
   - Returns: Updated Task object
   - Type signature: `Promise<Task>`

   **DELETE /api/{user_id}/tasks/{id}** - `deleteTask(userId, taskId)`
   - Deletes task
   - Returns: MessageResponse with success message
   - Type signature: `Promise<MessageResponse>`

   **PATCH /api/{user_id}/tasks/{id}/complete** - `toggleTaskCompletion(userId, taskId, completed)`
   - Toggles task completion status
   - Accepts: boolean (new completion status)
   - Returns: Updated Task object
   - Type signature: `Promise<Task>`

4. **Authentication Integration**:
   - Calls `getSession()` from auth-client
   - Extracts JWT token from session
   - Adds Authorization: Bearer header
   - Works seamlessly with Better Auth

5. **Error Handling**:
   - Catches HTTP errors (non-2xx responses)
   - Parses API error responses
   - Throws user-friendly error messages
   - Falls back to statusText if JSON parsing fails

6. **Type Safety Features**:
   - All methods fully typed with TypeScript
   - Generic `request<T>()` method for type inference
   - Interfaces match backend Pydantic schemas exactly
   - IDE autocomplete and type checking

7. **Developer Experience**:
   - Comprehensive JSDoc comments on all methods
   - Usage examples in documentation
   - Exported singleton instance: `todoAPI`
   - Clean API: `todoAPI.getTasks(userId, "pending")`

8. **Example Usage**:
   ```typescript
   import { todoAPI } from '@/lib/api'

   // List pending tasks
   const { tasks, count } = await todoAPI.getTasks(userId, "pending")

   // Create task
   const task = await todoAPI.createTask(userId, {
     title: "Buy groceries",
     description: "Milk, eggs, bread"
   })

   // Update task
   await todoAPI.updateTask(userId, task.id, {
     completed: true
   })

   // Delete task
   await todoAPI.deleteTask(userId, task.id)
   ```

9. **Updated tasks.md** - Marked T-209 as Completed [X]

The API client is now ready for use in React components (TaskList, TaskForm, etc.).

## Outcome

- ✅ Impact: Type-safe API client for all backend communication
- 🧪 Tests: Manual verification passed (types match schemas, methods complete)
- 📁 Files: 1 file created (lib/api.ts with 300+ lines)
- 🔁 Next prompts: T-210 (Build TaskList component using API client)
- 🧠 Reflection: Clean architecture with TypeScript providing excellent type safety. Generic request method enables code reuse.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
