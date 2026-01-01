# Phase I: Todo In-Memory Console App - Tasks

## Task Breakdown

This document breaks down Phase I implementation into atomic, testable tasks. Each task references the specification (spec.md) and plan (plan.md).

### Task Summary

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-001 | Setup Python project structure with UV | None | Completed [X] |
| T-002 | Create Task model dataclass | T-001 | Completed [X] |
| T-003 | Create TaskRepository class with in-memory storage | T-002 | Completed [X] |
| T-004 | Implement Repository CRUD methods | T-003 | Completed [X] |
| T-005 | Create TaskService with validation logic | T-004 | Completed [X] |
| T-006 | Implement Service business logic methods | T-005 | Completed [X] |
| T-007 | Create CLI interface with menu system | T-006 | Completed [X] |
| T-008 | Implement task listing display | T-007 | Completed [X] |
| T-009 | Implement add task workflow | T-007 | Completed [X] |
| T-010 | Implement update task workflow | T-007 | Completed [X] |
| T-011 | Implement delete task workflow | T-007 | Completed [X] |
| T-012 | Implement task completion toggle workflow | T-007 | Completed [X] |
| T-013 | Add comprehensive error handling | T-012 | Completed [X] |
| T-014 | Create README.md with setup instructions | T-013 | Completed [X] |
| T-015 | Test all workflows manually | T-014 | Completed [X] |

---

## Detailed Tasks

### T-001: Setup Python project structure with UV

**Priority**: High
**Estimated Time**: 15 minutes
**Related Spec**: FR-6, AC-6
**Related Plan**: Project Structure

**Description**:
Initialize Python project using UV package manager with proper directory structure and configuration.

**Preconditions**:
- UV is installed on system
- Terminal/command prompt available

**Steps**:
1. Navigate to `phase-1-console-app` directory
2. Initialize UV project: `uv init`
3. Create `src/` directory
4. Create subdirectories: `src/`, `tests/`, `docs/`
5. Update `pyproject.toml` with project metadata

**Expected Outputs**:
- `pyproject.toml` file configured
- `src/` directory with `__init__.py`
- `tests/` directory with `__init__.py`
- `.venv/` virtual environment created

**Artifacts**:
- `pyproject.toml`
- `src/__init__.py`
- `tests/__init__.py`

**Validation**:
```bash
uv --version
ls -la src/
cat pyproject.toml
```

---

### T-002: Create Task model dataclass

**Priority**: High
**Estimated Time**: 10 minutes
**Related Spec**: Data Model, FR-1, FR-2
**Related Plan**: Task Model

**Description**:
Define Task dataclass with all required attributes and string representation method.

**Preconditions**:
- Project structure exists (T-001)

**Steps**:
1. Create `src/models.py`
2. Import `dataclass` and `datetime`
3. Define Task dataclass with attributes:
   - `id: int`
   - `title: str`
   - `description: str`
   - `completed: bool`
   - `created_at: datetime`
   - `updated_at: datetime`
4. Add `__post_init__` to set default timestamps
5. Add `__str__` method for display

**Expected Outputs**:
- `src/models.py` with Task dataclass
- Proper type hints on all attributes
- Default values set in `__post_init__`

**Artifacts**:
- `src/models.py`

**Validation**:
```python
task = Task(id=1, title="Test", description="Test task", completed=False)
print(task)
assert task.completed == False
assert task.created_at is not None
```

---

### T-003: Create TaskRepository class with in-memory storage

**Priority**: High
**Estimated Time**: 15 minutes
**Related Spec**: Data Model, FR-1-FR-5
**Related Plan**: Task Repository

**Description**:
Create repository class to manage in-memory task storage with ID generation.

**Preconditions**:
- Task model exists (T-002)

**Steps**:
1. Create `src/repository.py`
2. Import Task model and typing modules
3. Define TaskRepository class with:
   - `tasks` list attribute
   - `next_id` integer attribute initialized to 1
   - `__init__` method
4. Add docstring explaining in-memory nature

**Expected Outputs**:
- `src/repository.py` with TaskRepository class
- Empty tasks list initialized
- next_id set to 1

**Artifacts**:
- `src/repository.py`

**Validation**:
```python
repo = TaskRepository()
assert repo.tasks == []
assert repo.next_id == 1
```

---

### T-004: Implement Repository CRUD methods

**Priority**: High
**Estimated Time**: 30 minutes
**Related Spec**: FR-1-FR-5, AC-1-AC-5
**Related Plan**: Repository Interface

**Description**:
Implement all CRUD operations in TaskRepository class.

**Preconditions**:
- TaskRepository class exists (T-003)

**Steps**:
1. Implement `create(title, description)` method:
   - Generate ID using `next_id`
   - Increment `next_id`
   - Create Task object with current timestamp
   - Append to tasks list
   - Return created task

2. Implement `get_all()` method:
   - Return copy of tasks list

3. Implement `get_by_id(id)` method:
   - Iterate through tasks
   - Return task if ID matches
   - Return None if not found

4. Implement `update(id, title, description)` method:
   - Find task by ID
   - Update title and/or description
   - Update `updated_at` timestamp
   - Return updated task or None

5. Implement `delete(id)` method:
   - Find task index by ID
   - Remove from list if found
   - Return True/False

6. Implement `toggle_complete(id)` method:
   - Find task by ID
   - Flip `completed` boolean
   - Update `updated_at` timestamp
   - Return updated task or None

**Expected Outputs**:
- All repository methods implemented
- Proper error handling for missing tasks
- Timestamps managed correctly

**Artifacts**:
- Updated `src/repository.py`

**Validation**:
```python
repo = TaskRepository()
task = repo.create("Test", "Description")
assert task.id == 1
assert repo.next_id == 2
assert len(repo.get_all()) == 1
found = repo.get_by_id(1)
assert found.title == "Test"
repo.toggle_complete(1)
assert found.completed == True
repo.delete(1)
assert len(repo.get_all()) == 0
```

---

### T-005: Create TaskService with validation logic

**Priority**: High
**Estimated Time**: 15 minutes
**Related Spec**: NFR-3, FR-1-FR-5
**Related Plan**: Task Service

**Description**:
Create service layer for business logic with input validation.

**Preconditions**:
- TaskRepository complete (T-004)

**Steps**:
1. Create `src/services.py`
2. Import TaskRepository and define constants:
   - `MAX_TITLE_LENGTH = 200`
   - `MAX_DESC_LENGTH = 1000`
3. Define TaskService class:
   - Accept TaskRepository in constructor
4. Add validation helper methods:
   - `validate_title(title)` - raises ValueError if invalid
   - `validate_description(description)` - raises ValueError if invalid

**Expected Outputs**:
- `src/services.py` with TaskService class
- Validation constants defined
- Helper validation methods implemented

**Artifacts**:
- `src/services.py`

**Validation**:
```python
service = TaskService(TaskRepository())
# Test valid title
service.validate_title("Valid title")
# Test invalid title (should raise error)
try:
    service.validate_title("")  # Should raise ValueError
except ValueError:
    print("Validation works")
```

---

### T-006: Implement Service business logic methods

**Priority**: High
**Estimated Time**: 20 minutes
**Related Spec**: FR-1-FR-5, AC-1-AC-5
**Related Plan**: Service Interface

**Description**:
Implement business logic methods in TaskService that wrap repository with validation.

**Preconditions**:
- TaskService class exists (T-005)
- Repository complete (T-004)

**Steps**:
1. Implement `add_task(title, description)`:
   - Validate title and description
   - Call repository.create()
   - Return task

2. Implement `list_tasks()`:
   - Call repository.get_all()
   - Return tasks list

3. Implement `update_task(id, title, description)`:
   - Validate inputs
   - Call repository.update()
   - Raise error if task not found
   - Return updated task

4. Implement `delete_task(id)`:
   - Call repository.delete()
   - Raise error if task not found
   - Return success

5. Implement `mark_complete(id)`:
   - Call repository.toggle_complete()
   - Raise error if task not found
   - Return updated task

**Expected Outputs**:
- All service methods implemented
- Validation called before repository operations
- Meaningful error messages

**Artifacts**:
- Updated `src/services.py`

**Validation**:
```python
repo = TaskRepository()
service = TaskService(repo)
task = service.add_task("Title", "Description")
assert task.title == "Title"
# Test validation
try:
    service.add_task("", "")  # Should raise error
except ValueError as e:
    assert "Title" in str(e)
```

---

### T-007: Create CLI interface with menu system

**Priority**: High
**Estimated Time**: 20 minutes
**Related Spec**: FR-6, AC-6
**Related Plan**: CLI Interface

**Description**:
Create main application loop with menu display and user input handling.

**Preconditions**:
- TaskService complete (T-006)

**Steps**:
1. Create `src/main.py`
2. Import TaskService and TaskRepository
3. Define menu text constant:
   ```
   === Todo App (Phase I) ===
   1. Add Task
   2. List Tasks
   3. Update Task
   4. Delete Task
   5. Mark Task Complete
   6. Exit
   ```
4. Implement `display_menu()` function
5. Implement `get_user_choice()` function:
   - Get input from user
   - Validate it's between 1-6
   - Return integer choice
6. Implement `main()` function:
   - Initialize repository and service
   - Create while loop
   - Display menu
   - Get choice
   - Route to appropriate handler (placeholder for now)

**Expected Outputs**:
- Working menu system
- Input validation for menu choices
- Main application loop

**Artifacts**:
- `src/main.py`

**Validation**:
```bash
python src/main.py
# Should display menu
# Should accept 1-6
# Should reject invalid choices
# Should exit on choice 6
```

---

### T-008: Implement task listing display

**Priority**: Medium
**Estimated Time**: 15 minutes
**Related Spec**: FR-2, AC-2
**Related Plan**: CLI Interface - display_tasks()

**Description**:
Create formatted display for listing all tasks with completion indicators.

**Preconditions**:
- Menu system exists (T-007)

**Steps**:
1. Implement `display_tasks(tasks)` function:
   - Check if tasks list is empty
   - If empty, display "No tasks yet."
   - If not empty, loop through tasks
   - For each task display:
     ```
     [ID] Title (Status)
     Description
     Created: date
     ```
   - Use ✓ for completed, ✗ for incomplete
   - Show total task count in header

2. Wire up menu option 2 to call `display_tasks(service.list_tasks())`

**Expected Outputs**:
- Formatted task list
- Visual completion indicators
- Empty state message
- Task count display

**Artifacts**:
- Updated `src/main.py`

**Validation**:
```bash
# Add some tasks, then list them
# Should show formatted output with ✓/✗
# Should show dates and descriptions
```

---

### T-009: Implement add task workflow

**Priority**: High
**Estimated Time**: 20 minutes
**Related Spec**: FR-1, AC-1
**Related Plan**: CLI Interface - get_task_input()

**Description**:
Implement user workflow for adding new tasks.

**Preconditions**:
- Menu system exists (T-007)

**Steps**:
1. Implement `get_task_input()` function:
   - Prompt for title: "Enter task title: "
   - Prompt for description: "Enter task description (optional): "
   - Validate title is not empty
   - Return title and description

2. Implement `add_task_handler()` function:
   - Call `get_task_input()`
   - Call `service.add_task(title, description)`
   - Display success message: "Task added successfully!"

3. Wire up menu option 1 to call `add_task_handler()`

4. Handle validation errors from service

**Expected Outputs**:
- User can input task title
- User can input optional description
- Task created and stored
- Success message displayed

**Artifacts**:
- Updated `src/main.py`

**Validation**:
```bash
# Select option 1
# Enter title: "Buy groceries"
# Enter description: "Milk, eggs, bread"
# Should show success message
# Should see task in list
```

---

### T-010: Implement update task workflow

**Priority**: Medium
**Estimated Time**: 20 minutes
**Related Spec**: FR-3, AC-3
**Related Plan**: CLI Interface

**Description**:
Implement user workflow for updating existing tasks.

**Preconditions**:
- Add task workflow complete (T-009)

**Steps**:
1. Implement `get_task_id()` function:
   - Prompt for task ID: "Enter task ID: "
   - Validate it's a number
   - Return integer ID

2. Implement `update_task_handler()` function:
   - Display current tasks first
   - Call `get_task_id()`
   - Prompt for new title (or leave blank to keep current)
   - Prompt for new description (or leave blank to keep current)
   - Call `service.update_task(id, title, description)`
   - Display success message

3. Wire up menu option 3 to call `update_task_handler()`

4. Handle errors for invalid IDs

**Expected Outputs**:
- User can update task by ID
- Fields can be kept blank to preserve current values
- Error message for invalid ID
- Success message on update

**Artifacts**:
- Updated `src/main.py`

**Validation**:
```bash
# Create a task, then update it
# Should show updated details in list
# Should show error for non-existent ID
```

---

### T-011: Implement delete task workflow

**Priority**: Medium
**Estimated Time**: 15 minutes
**Related Spec**: FR-4, AC-4
**Related Plan**: CLI Interface

**Description**:
Implement user workflow for deleting tasks with confirmation.

**Preconditions**:
- Task listing complete (T-008)

**Steps**:
1. Implement `delete_task_handler()` function:
   - Display current tasks first
   - Call `get_task_id()`
   - Display task details
   - Ask for confirmation: "Delete this task? (y/n): "
   - If yes, call `service.delete_task(id)`
   - Display success or cancellation message

2. Wire up menu option 4 to call `delete_task_handler()`

**Expected Outputs**:
- User can delete task by ID
- Confirmation prompt before deletion
- Task removed from list
- Success message displayed

**Artifacts**:
- Updated `src/main.py`

**Validation**:
```bash
# Create task, then delete it
# Should confirm before deletion
# Should show success message
# Task should not appear in list
```

---

### T-012: Implement task completion toggle workflow

**Priority**: High
**Estimated Time**: 15 minutes
**Related Spec**: FR-5, AC-5
**Related Plan**: CLI Interface

**Description**:
Implement user workflow for toggling task completion status.

**Preconditions**:
- Task listing complete (T-008)

**Steps**:
1. Implement `toggle_complete_handler()` function:
   - Display current tasks first
   - Call `get_task_id()`
   - Call `service.mark_complete(id)`
   - Display success message with new status

2. Wire up menu option 5 to call `toggle_complete_handler()`

3. Handle errors for invalid IDs

**Expected Outputs**:
- User can mark task complete
- User can mark task incomplete (toggle)
- Status indicator updates in list
- Success message displayed

**Artifacts**:
- Updated `src/main.py`

**Validation**:
```bash
# Create task
# Toggle to complete (should show ✓)
# Toggle again (should show ✗)
```

---

### T-013: Add comprehensive error handling

**Priority**: Medium
**Estimated Time**: 20 minutes
**Related Spec**: NFR-1, NFR-3
**Related Plan**: Error Handling

**Description**:
Add robust error handling throughout the application.

**Preconditions**:
- All workflows implemented (T-009-T-012)

**Steps**:
1. Add try-except blocks around all user input:
   - Handle ValueError for invalid numbers
   - Handle KeyboardInterrupt for Ctrl+C
   - Handle EOFError for Ctrl+D

2. Add validation for menu choice:
   - Ensure input is between 1-6
   - Show clear error message: "Invalid option. Please select 1-6"

3. Add validation for task ID:
   - Ensure input is valid integer
   - Show error if not

4. Handle service validation errors:
   - Catch ValueError from service methods
   - Display user-friendly messages

5. Add graceful shutdown:
   - Catch KeyboardInterrupt in main loop
   - Display "Goodbye!" message

**Expected Outputs**:
- Invalid inputs handled gracefully
- Clear error messages
- No crashes on user error
- Graceful application exit

**Artifacts**:
- Updated `src/main.py` and `src/services.py`

**Validation**:
```bash
# Test various invalid inputs:
# - Non-numeric IDs
# - Empty task titles
# - Invalid menu choices
# Should show helpful error messages
# Application should not crash
```

---

### T-014: Create README.md with setup instructions

**Priority**: Medium
**Estimated Time**: 20 minutes
**Related Spec**: Success Criteria
**Related Plan**: Deployment

**Description**:
Create comprehensive README with setup, usage, and project information.

**Preconditions**:
- All code complete (T-013)

**Steps**:
1. Create `README.md` in project root
2. Include sections:
   - Project title and description
   - Prerequisites (Python, UV)
   - Installation steps
   - Running the application
   - Usage instructions with examples
   - Features implemented
   - Tech stack
   - Project structure
   - Known limitations
3. Add screenshots or example outputs

**Expected Outputs**:
- Professional README.md
- Clear setup instructions
- Usage examples
- Project overview

**Artifacts**:
- `README.md`

**Validation**:
```bash
# Follow README instructions
# Should be able to:
# - Install dependencies
# - Run application
# - Understand all features
```

---

### T-015: Test all workflows manually

**Priority**: High
**Estimated Time**: 30 minutes
**Related Spec**: AC-1-AC-6, Success Criteria
**Related Plan**: Testing Strategy

**Description**:
Comprehensive manual testing of all application features.

**Preconditions**:
- Application complete (T-013)
- README created (T-014)

**Steps**:
1. Test task creation:
   - Add task with title only
   - Add task with title and description
   - Try adding empty title (should fail)

2. Test task listing:
   - List tasks when empty
   - List tasks with items
   - Verify formatting and indicators

3. Test task update:
   - Update title only
   - Update description only
   - Update both
   - Update non-existent ID (should fail)

4. Test task deletion:
   - Delete existing task with confirmation
   - Try deleting non-existent ID (should fail)

5. Test completion toggle:
   - Mark task as complete (✓ appears)
   - Mark as incomplete (✗ appears)
   - Toggle multiple times

6. Test error handling:
   - Invalid menu choices
   - Non-numeric IDs
   - KeyboardInterrupt (Ctrl+C)

7. Document any bugs found
8. Fix bugs and retest

**Expected Outputs**:
- All features working correctly
- No crashes
- Good error messages
- User-friendly experience

**Artifacts**:
- Test results (optional)

**Validation**:
- [ ] Can add tasks
- [ ] Can list tasks
- [ ] Can update tasks
- [ ] Can delete tasks
- [ ] Can toggle completion
- [ ] Error handling works
- [ ] Application exits cleanly
- [ ] Ready for demo video

---

## Task Dependencies Graph

```
T-001 (Setup)
  ├─→ T-002 (Task Model)
  │     └─→ T-003 (Repository)
  │           └─→ T-004 (Repository CRUD)
  │                 └─→ T-005 (Service Class)
  │                       └─→ T-006 (Service Logic)
  │                             ├─→ T-007 (Menu System)
  │                             │     ├─→ T-008 (List Tasks)
  │                             │     ├─→ T-009 (Add Task)
  │                             │     ├─→ T-010 (Update Task)
  │                             │     ├─→ T-011 (Delete Task)
  │                             │     ├─→ T-012 (Toggle Complete)
  │                             │     └─→ T-013 (Error Handling)
  │                             │           └─→ T-014 (README)
  │                             │                 └─→ T-015 (Testing)
  │                             └─→ T-007
```

## Progress Tracking

Use this checklist to track overall phase progress:

- [ ] Project setup complete
- [ ] Data models defined
- [ ] Repository layer complete
- [ ] Service layer complete
- [ ] CLI interface complete
- [ ] All workflows implemented
- [ ] Error handling comprehensive
- [ ] Documentation complete
- [ ] Testing complete
- [ ] Demo ready

## Time Estimates

| Task | Est. Time | Actual Time | Status |
|-------|-----------|--------------|---------|
| T-001 | 15 min | - | Pending |
| T-002 | 10 min | - | Pending |
| T-003 | 15 min | - | Pending |
| T-004 | 30 min | - | Pending |
| T-005 | 15 min | - | Pending |
| T-006 | 20 min | - | Pending |
| T-007 | 20 min | - | Pending |
| T-008 | 15 min | - | Pending |
| T-009 | 20 min | - | Pending |
| T-010 | 20 min | - | Pending |
| T-011 | 15 min | - | Pending |
| T-012 | 15 min | - | Pending |
| T-013 | 20 min | - | Pending |
| T-014 | 20 min | - | Pending |
| T-015 | 30 min | - | Pending |
| **Total** | **~3 hours** | - | |

## Notes

- All tasks must be completed before submitting Phase I
- Use Claude Code for implementation (no manual coding)
- Document any deviations from tasks
- Create Prompt History Records for all user prompts
- Consider creating unit tests after T-015 (optional)
