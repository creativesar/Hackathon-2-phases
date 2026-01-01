# Phase I: Todo In-Memory Console App - Plan

## Architecture Overview
Single-file Python console application using in-memory data structures. Modular design with clear separation between business logic and UI layer.

## Technology Stack

| Component | Technology | Version |
|------------|-------------|----------|
| Language | Python | 3.13+ |
| Package Manager | UV | Latest |
| Development Tool | Claude Code | Latest |
| Spec Management | Spec-Kit Plus | Latest |

## System Architecture

```
┌─────────────────────────────────────────────────┐
│          Console Application (CLI)             │
│  ┌──────────────────────────────────────────┐  │
│  │         Task Manager (Business Logic)    │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Task Model                    │  │  │
│  │  │  - id, title, description     │  │  │
│  │  │  - completed, created_at       │  │  │
│  │  │  - updated_at                │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Task Repository (In-Memory)   │  │  │
│  │  │  - tasks: List[Task]          │  │  │
│  │  │  - next_id: int               │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Task Services                │  │  │
│  │  │  - add_task()                │  │  │
│  │  │  - list_tasks()              │  │  │
│  │  │  - update_task()             │  │  │
│  │  │  - delete_task()             │  │  │
│  │  │  - toggle_complete()          │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │         CLI Interface (UI Layer)        │  │
│  │  - display_menu()                   │  │
│  │  - display_tasks()                  │  │
│  │  - get_user_input()                │  │
│  │  - show_message()                  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Component Design

### 1. Task Model (`Task` class)
**Purpose**: Define data structure for todo items

**Location**: `src/models.py` or single file

**Attributes**:
```python
@dataclass
class Task:
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime
```

**Methods**:
- `__init__`: Initialize task with defaults
- `__str__`: String representation for display

### 2. Task Repository (`TaskRepository` class)
**Purpose**: Manage in-memory task storage

**Location**: `src/repository.py` or single file

**State**:
```python
tasks: List[Task] = []
next_id: int = 1
```

**Methods**:
- `create(title, description) -> Task`: Create and store task
- `get_all() -> List[Task]`: Return all tasks
- `get_by_id(id) -> Optional[Task]`: Find task by ID
- `update(id, title, description) -> Optional[Task]`: Update task
- `delete(id) -> bool`: Remove task, return success
- `toggle_complete(id) -> Optional[Task]`: Flip completion status

### 3. Task Service (`TaskService` class)
**Purpose**: Business logic layer with validation

**Location**: `src/services.py` or single file

**Methods**:
- `add_task(title, description) -> Task`: Validate and create
- `list_tasks() -> List[Task]`: Get all tasks
- `update_task(id, title, description) -> Task`: Validate and update
- `delete_task(id) -> bool`: Validate and delete
- `mark_complete(id) -> Task`: Toggle completion

**Validations**:
- Title length: 1-200 characters
- Description length: 0-1000 characters
- Task ID exists for operations

### 4. CLI Interface (`main` module)
**Purpose**: Command-line user interface

**Location**: `src/main.py` or single file

**Functions**:
- `display_menu()`: Show main menu options
- `display_tasks(tasks)`: Format and show task list
- `get_task_input()`: Collect task details from user
- `get_task_id()`: Get and validate task ID
- `show_success(message)`: Display success message
- `show_error(message)`: Display error message
- `main()`: Main application loop

## Data Flow

### Add Task Flow
```
User selects "Add Task"
  → display_menu() calls get_task_input()
  → TaskService.add_task(title, description)
  → TaskRepository.create(title, description)
  → TaskRepository.next_id++
  → Return Task object
  → show_success("Task added successfully")
```

### List Tasks Flow
```
User selects "List Tasks"
  → TaskService.list_tasks()
  → TaskRepository.get_all()
  → Return List[Task]
  → display_tasks(tasks)
  → Format tasks with completion indicators
```

### Update Task Flow
```
User selects "Update Task"
  → get_task_id()
  → TaskService.update_task(id, title, description)
  → TaskRepository.update(id, title, description)
  → Validate task exists
  → Update fields and timestamp
  → Return updated Task
  → show_success("Task updated successfully")
```

### Delete Task Flow
```
User selects "Delete Task"
  → get_task_id()
  → Confirm deletion
  → TaskService.delete_task(id)
  → TaskRepository.delete(id)
  → Return success status
  → show_success("Task deleted successfully")
```

### Toggle Complete Flow
```
User selects "Mark Task Complete"
  → get_task_id()
  → TaskService.mark_complete(id)
  → TaskRepository.toggle_complete(id)
  → Flip completed flag
  → Update timestamp
  → Return updated Task
  → show_success("Task status updated")
```

## Project Structure

```
phase-1-console-app/
├── src/
│   ├── __init__.py
│   ├── models.py          # Task dataclass
│   ├── repository.py      # In-memory storage
│   ├── services.py        # Business logic
│   └── main.py          # CLI interface
├── tests/                # Optional tests
│   ├── test_models.py
│   ├── test_repository.py
│   └── test_services.py
├── pyproject.toml         # UV project config
├── README.md            # Setup instructions
└── docs/
    ├── spec.md           # This specification
    ├── plan.md          # This plan
    └── tasks.md         # Implementation tasks
```

## Interfaces and APIs

### Repository Interface
```python
class TaskRepository:
    def create(self, title: str, description: str) -> Task
    def get_all(self) -> List[Task]
    def get_by_id(self, id: int) -> Optional[Task]
    def update(self, id: int, title: str, description: str) -> Optional[Task]
    def delete(self, id: int) -> bool
    def toggle_complete(self, id: int) -> Optional[Task]
```

### Service Interface
```python
class TaskService:
    def add_task(self, title: str, description: str) -> Task
    def list_tasks(self) -> List[Task]
    def update_task(self, id: int, title: str, description: str) -> Task
    def delete_task(self, id: int) -> bool
    def mark_complete(self, id: int) -> Task
```

## Error Handling

### Validation Errors
- **Title too short**: "Title must be at least 1 character"
- **Title too long**: "Title cannot exceed 200 characters"
- **Description too long**: "Description cannot exceed 1000 characters"
- **Task not found**: "Task with ID {id} not found"

### Input Errors
- **Invalid menu choice**: "Invalid option. Please select 1-6"
- **Non-numeric ID**: "Please enter a valid number"
- **Empty input**: "Input cannot be empty"

## Non-Functional Requirements

### Performance
- All CRUD operations: O(n) time complexity
- Memory: Store up to 1000 tasks efficiently
- Response time: < 1 second for all operations

### Maintainability
- PEP 8 compliance
- Type hints on all functions
- Docstrings for all public methods
- Clear separation of concerns

### Usability
- Clear menu with numbered options
- Helpful error messages
- Task count displayed in header
- Completion status visually indicated (✓/✗)

## Security Considerations

- Input validation on all user inputs
- Sanitize task titles and descriptions (basic)
- Prevent code injection via input
- No sensitive data stored (in-memory only)

## Dependencies and Imports

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional
import sys
```

## Configuration

No external configuration required. All settings hardcoded:
- Max title length: 200 characters
- Max description length: 1000 characters
- Max tasks in memory: 1000 (soft limit)

## Testing Strategy

### Unit Tests (Optional but Recommended)
- Test Task model creation and validation
- Test Repository CRUD operations
- Test Service business logic

### Manual Testing
- Add task with title only
- Add task with title and description
- List all tasks
- Update existing task
- Delete task
- Toggle completion status
- Test error handling (invalid ID, empty input, etc.)

## Migration Path to Phase II

### Data Model Reuse
- `Task` class becomes SQLModel in Phase II
- Same attributes persist
- Add `user_id` field in Phase II

### Service Layer Reuse
- Business logic (validation) remains same
- Replace Repository with SQLModel database operations
- API layer wraps existing services

### Key Changes for Phase II
- In-memory storage → PostgreSQL database
- CLI interface → Web UI (Next.js)
- Direct service calls → REST API (FastAPI)
- Add authentication (JWT)

## Decision Records

### DR-001: Single File vs Modular Structure
**Decision**: Use modular structure with separate files
**Rationale**:
- Clear separation of concerns
- Easier to test individual components
- Better preparation for Phase II migration
- Demonstrates software engineering best practices

**Trade-offs**:
- More files to manage
- Slightly more complex imports

### DR-002: Dataclass vs Pydantic Model
**Decision**: Use Python dataclass for Task model
**Rationale**:
- Built-in, no external dependencies
- Simple and lightweight
- Sufficient for in-memory storage

**Trade-offs**:
- Less validation than Pydantic
- Will need migration to SQLModel in Phase II anyway

### DR-003: UUID vs Integer ID
**Decision**: Use integer auto-increment ID
**Rationale**:
- Simpler for console display
- User-friendly (easy to type)
- Sequential numbering intuitive

**Trade-offs**:
- Not globally unique (acceptable for single-user app)
- Will change in Phase II (database handles uniqueness)

## Risk Analysis

### Risk 1: Data Loss on Application Exit
**Likelihood**: High (by design)
**Impact**: Low (in-memory only, no production use)
**Mitigation**: Document as expected behavior
**Accept**: Yes - this is Phase I scope

### Risk 2: Memory Exhaustion with Many Tasks
**Likelihood**: Low (user would need 1000+ tasks)
**Impact**: Medium (application crash)
**Mitigation**: Document max tasks, validate before creation

### Risk 3: Invalid User Input
**Likelihood**: High (user error)
**Impact**: Low (handled with error messages)
**Mitigation**: Comprehensive validation and error handling

## Deployment

### Local Development
```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment
uv venv

# Activate (Linux/Mac)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Run application
python src/main.py
```

### Package Structure
No packaging required for Phase I. Direct execution from source.

## Success Criteria

- [ ] All 5 Basic Level features implemented
- [ ] Modular code structure with separation of concerns
- [ ] Complete error handling and validation
- [ ] Clean, readable code with docstrings
- [ ] PEP 8 compliant
- [ ] Working demo in under 90 seconds

## Next Phase Preparation

### Deliverables for Phase II
- Task model definition (will become SQLModel)
- Service layer with business logic (reusable)
- Validation rules (title/description lengths)
- Understanding of CRUD operations

### Code Reuse
- Business logic services can be adapted
- Validation rules remain same
- Data model attributes persist

### New Requirements for Phase II
- SQLModel database models
- REST API endpoints (FastAPI)
- User authentication (Better Auth + JWT)
- Web frontend (Next.js)
- Persistent storage (Neon PostgreSQL)
