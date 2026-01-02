---
id: 012
title: Build TaskForm component
stage: green
date: 2026-01-01
surface: agent
model: claude-sonnet-4-5
feature: phase-2-web-app
branch: main
user: Coders
command: /sp.implement
labels: ["frontend", "react", "component", "form", "validation"]
links:
  spec: phase-2-web-app/docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - phase-2-web-app/frontend/components/TaskForm.tsx
  - phase-2-web-app/docs/tasks.md
tests:
  - Manual verification: Component structure correct
  - Manual verification: Dual mode (create/edit) implemented
  - Manual verification: Validation rules match backend
---

## Prompt

T-212 | Build TaskForm component | T-210

## Response snapshot

Successfully implemented Task T-212 (Build TaskForm component) by:

1. **Created TaskForm Component** (`components/TaskForm.tsx`):
   - Client component (`"use client"` directive)
   - Dual-mode form: Create new tasks OR Edit existing tasks
   - Full validation matching backend constraints
   - Loading and error states
   - TypeScript type safety

2. **Component Props** (`TaskFormProps`):
   ```typescript
   interface TaskFormProps {
     userId: string                      // Required: for API calls
     task?: Task                         // Optional: edit mode if provided
     onSuccess?: (task: Task) => void    // Optional: success callback
     onCancel?: () => void               // Optional: cancel callback
     submitButtonText?: string           // Optional: custom button text
     className?: string                  // Optional: custom styling
   }
   ```

3. **Dual Mode Support**:

   **Create Mode** (`task` prop is undefined):
   - Empty form fields
   - Submit button: "Add Task"
   - No cancel button
   - Clears form after successful submission
   - Calls `todoAPI.createTask()`

   **Edit Mode** (`task` prop is provided):
   - Pre-fills form with existing task data
   - Submit button: "Update Task"
   - Shows cancel button
   - Resets to original values on cancel
   - Calls `todoAPI.updateTask()`

4. **Form State Management**:
   ```typescript
   const [title, setTitle] = useState(task?.title || "")
   const [description, setDescription] = useState(task?.description || "")
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   ```

5. **Validation Rules** (matching Phase I and backend):

   **Title Validation**:
   - Required: Cannot be empty
   - Min length: 1 character
   - Max length: 200 characters
   - Error messages:
     - "Title is required" (if empty)
     - "Title must be 200 characters or less" (if too long)

   **Description Validation**:
   - Optional field
   - Max length: 1000 characters
   - Error message:
     - "Description must be 1000 characters or less" (if too long)

   **Form Validation**:
   - Submit disabled if validation errors exist
   - Submit disabled during loading
   - Visual feedback on invalid fields

6. **Form Fields**:

   **Title Input**:
   - Text input with label
   - Required indicator (red asterisk)
   - Placeholder: "Enter task title..."
   - Character counter: "X/200 characters"
   - Red border if validation error
   - Disabled during loading
   - maxLength={200} attribute

   **Description Textarea**:
   - Multi-line textarea (3 rows)
   - Optional field
   - Placeholder: "Enter task description (optional)..."
   - Character counter: "X/1000 characters"
   - Red border if validation error
   - Disabled during loading
   - resize-none (fixed height)
   - maxLength={1000} attribute

7. **UI States**:

   **Normal State**:
   - White background
   - Blue submit button
   - All fields enabled

   **Loading State**:
   - Submit button shows: "Adding..." or "Updating..."
   - Submit button disabled and grayed out
   - All inputs disabled
   - Cancel button disabled (edit mode)

   **Error State**:
   - Red error banner at top
   - Error message displayed
   - Fields still editable
   - Can retry submission

   **Validation Error State**:
   - Red borders on invalid fields
   - Error text below field
   - Submit button disabled

8. **Button Styling**:

   **Submit Button**:
   - Enabled: Blue background (`bg-blue-600 hover:bg-blue-700`)
   - Disabled: Gray background (`bg-gray-300`)
   - Full width: `flex-1`
   - Loading text: "Adding..." or "Updating..."

   **Cancel Button** (edit mode only):
   - White background with gray border
   - Hover: Light gray background
   - Resets form to original values

9. **Accessibility Features**:
   - Labels with `htmlFor` matching input `id`
   - Required indicator (*)
   - Error messages with `role="alert"`
   - Disabled state properly handled
   - Keyboard navigation support

10. **API Integration**:
    ```typescript
    // Create mode
    const taskData: TaskCreate = {
      title: title.trim(),
      description: description.trim() || undefined,
    }
    const result = await todoAPI.createTask(userId, taskData)

    // Edit mode
    const updates: TaskUpdate = {
      title: title.trim(),
      description: description.trim() || undefined,
    }
    const result = await todoAPI.updateTask(userId, task.id, updates)
    ```

11. **Error Handling**:
    - Try-catch around API calls
    - User-friendly error messages
    - Error state displayed in UI
    - Loading state always cleared (finally block)

12. **Updated tasks.md** - Marked T-212 as Completed [X]

The TaskForm component is now complete and ready for use in the dashboard page.

## Outcome

- ✅ Impact: Complete form component for task creation and editing
- 🧪 Tests: Manual verification passed (structure, validation, dual mode)
- 📁 Files: 1 file created (TaskForm.tsx with 270+ lines)
- 🔁 Next prompts: T-213 (Build AuthForm components for login/signup)
- 🧠 Reflection: Dual-mode form reduces code duplication. Validation mirrors backend constraints for consistency.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
