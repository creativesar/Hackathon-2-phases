# Todo In-Memory Console Application

A simple command-line todo application with CRUD operations, built using Spec-Driven Development methodology.

**Phase I** | **Points: 100** | **Due: Dec 7, 2025**

## Features

- ✅ **Add Task** - Create tasks with title (1-200 chars) and optional description (0-1000 chars)
- ✅ **List Tasks** - View all tasks with completion status indicators (✓/✗)
- ✅ **Update Task** - Modify task title and/or description
- ✅ **Delete Task** - Remove tasks from the list with confirmation
- ✅ **Mark Complete** - Toggle task completion status
- ✅ **Auto-incrementing IDs** - Tasks are numbered sequentially starting from 1
- ✅ **Input Validation** - Comprehensive validation for all user inputs
- ✅ **Error Handling** - Graceful error messages for invalid operations
- ✅ **In-Memory Storage** - Fast in-memory task management

## Tech Stack

- **Language**: Python 3.13+
- **Package Manager**: UV (modern Python package manager)
- **Development Tool**: Claude Code (Spec-Driven Development)
- **Architecture**: Clean architecture with separation of concerns
  - Model Layer: Task dataclass
  - Repository Layer: In-memory storage
  - Service Layer: Business logic with validation
  - Presentation Layer: CLI interface

## Installation

### Prerequisites

- Python 3.13 or higher
- UV package manager (install from https://github.com/astral-sh/uv)

### Setup

```bash
# Navigate to project directory
cd phase-1-console-app

# Install dependencies with UV
uv sync

# Run the application
uv run python src/main.py
```

Or with virtual environment:

```bash
# Create virtual environment (if needed)
uv venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Run application
python src/main.py
```

## Usage

### Running the Application

```bash
python src/main.py
```

### Menu Options

```
=== Todo App (Phase I) ===
1. Add Task
2. List Tasks
3. Update Task
4. Delete Task
5. Mark Task Complete
6. Exit
```

### Adding Tasks

1. Select option `1` from the menu
2. Enter task title (1-200 characters, required)
3. Enter task description (0-1000 characters, optional)

**Example**:
```
Enter task title: Buy groceries
Enter task description (optional, press Enter to skip): Milk, eggs, bread

Task added successfully!
ID: 1
Title: Buy groceries
 Description: Milk, eggs, bread
```

### Listing Tasks

1. Select option `2` from the menu
2. View all tasks with completion status

**Example Output**:
```
--- Task List ---
Total tasks: 3

[1] ✓ Buy groceries
    Description: Milk, eggs, bread
    Created: 2025-12-07 14:30:45

[2] ✗ Call mom
    Description: Evening chat
    Created: 2025-12-07 15:00:00

[3] ✗ Finish project report
    Description: Complete documentation
    Created: 2025-12-07 16:30:00
----------------------------------------
```

### Updating Tasks

1. Select option `3` from the menu
2. Enter the task ID to update
3. Enter new title (or press Enter to keep current)
4. Enter new description (or press Enter to keep current)

**Example**:
```
--- Update Task ---

[1] ✓ Buy groceries
    Description: Milk, eggs, bread

Enter task ID: 1

Current task:
 Title: Buy groceries
 Description: Milk, eggs, bread
 Status: Completed

Enter new values (leave blank to keep current):
 Title [Buy groceries]: Buy groceries and fruits
 Description [Milk, eggs, bread]: Milk, eggs, bread, fruits

Task updated successfully!
ID: 1
Title: Buy groceries and fruits
 Description: Milk, eggs, bread, fruits
```

### Deleting Tasks

1. Select option `4` from the menu
2. Enter the task ID to delete
3. Confirm deletion

**Example**:
```
--- Delete Task ---

[1] ✓ Buy groceries
    Description: Milk, eggs, bread

Enter task ID: 1

Task to delete:
ID: 1
Title: Buy groceries
 Description: Milk, eggs, bread

Delete this task? (y/n): y

Task deleted successfully!
ID: 1
Title: Buy groceries
```

### Marking Tasks Complete

1. Select option `5` from the menu
2. Enter the task ID to toggle
3. Task status changes (completed ↔ incomplete)

**Example**:
```
--- Mark Task Complete ---

[1] ✗ Call mom
    Description: Evening chat
    Created: 2025-12-07 15:00:00

Enter task ID: 2

Task status updated!
ID: 2
Title: Call mom
Status: Completed
```

### Exiting the Application

1. Select option `6` from the menu
2. Application displays goodbye message and exits

## Project Structure

```
phase-1-console-app/
├── src/
│   ├── __init__.py          # Package initialization
│   ├── main.py             # CLI interface and menu system
│   ├── models.py            # Task dataclass
│   ├── repository.py         # In-memory storage layer
│   └── services.py          # Business logic and validation
├── tests/
│   └── __init__.py          # Test package initialization
├── docs/
│   ├── spec.md               # Requirements specification
│   ├── plan.md               # Architecture and design plan
│   └── tasks.md              # Implementation tasks and checklist
├── .venv/                   # Virtual environment (created by UV)
├── pyproject.toml          # Project configuration
└── README.md                # This file
```

## Validation Rules

- **Title**: Must be 1-200 characters (required)
- **Description**: Must be 0-1000 characters (optional)
- **Task ID**: Auto-incrementing integer starting from 1
- **Timestamps**: Automatically set on creation and update

## Error Handling

The application handles various error scenarios gracefully:

- **Invalid menu choice**: Shows error message and prompts for input again
- **Invalid task ID**: Validates ID is a positive number
- **Non-existent task ID**: Shows clear error message
- **Validation errors**: User-friendly error messages for invalid inputs
- **Keyboard Interrupt**: Graceful shutdown on Ctrl+C
- **Unexpected errors**: Catches and displays error messages

## Limitations

- Data is stored **in-memory only** - All data is lost when application exits
- No persistence - Tasks are not saved to disk or database
- No search or filter functionality (planned for Phase II)
- No task priorities or tags (planned for Phase V)
- Single user only - No multi-user support

## Specification Compliance

This application implements all requirements from the specification:

- ✅ **FR-1**: Task Creation with validation
- ✅ **FR-2**: Task Listing with status indicators
- ✅ **FR-3**: Task Update with modification tracking
- ✅ **FR-4**: Task Deletion with confirmation
- ✅ **FR-5**: Task Completion toggle with timestamp updates
- ✅ **FR-6**: User Interface with clear menu system

All acceptance criteria (AC-1 through AC-6) have been met.

## Phase Progression

**Current Phase**: I (Console App) - ✅ Complete

**Next Phase**: II (Web Application)
- This implementation serves as the foundation
- Task model and validation rules will be inherited
- Architecture patterns will be extended for multi-user support
- In-memory storage will be replaced with PostgreSQL database

## Development Notes

This project was developed using **Spec-Driven Development** methodology:

1. **Specify**: Complete requirements defined in `docs/spec.md`
2. **Plan**: Architecture and design documented in `docs/plan.md`
3. **Tasks**: Implementation breakdown in `docs/tasks.md`
4. **Implement**: Code generated following the plan (this implementation)

All code follows:
- PEP 8 style guide
- Clean architecture with separation of concerns
- Type hints for all function parameters and return values
- Comprehensive docstrings for all modules and functions

## Future Enhancements

The following features are planned for future phases:

- **Phase II**: Web UI, persistent storage (PostgreSQL), user authentication
- **Phase III**: AI chatbot interface, natural language commands
- **Phase IV**: Kubernetes deployment with Docker containers
- **Phase V**: Cloud deployment, event streaming (Kafka), recurring tasks

## License

This project is part of the Hackathon II submission.

---

**Spec-Driven Development** | **Claude Code** | **Phase I Complete** ✅
