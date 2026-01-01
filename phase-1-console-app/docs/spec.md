# Phase I: Todo In-Memory Console App - Specification

## Overview
Build a command-line todo application that stores tasks in memory using Python. This is the foundation phase that establishes core functionality and data models.

**Points**: 100 | **Due Date**: Dec 7, 2025

## Purpose
Demonstrate Spec-Driven Development by building a functional console application with core CRUD operations for todo management.

## User Stories

### US-1: Add Task
**As a user, I want to create a new task with title and description, so I can remember what needs to be done.**

### US-2: View Task List
**As a user, I want to see all my tasks with their completion status, so I can track my progress.**

### US-3: Update Task
**As a user, I want to modify an existing task's details, so I can keep my information up to date.**

### US-4: Delete Task
**As a user, I want to remove tasks from my list, so I can clean up completed or unwanted items.**

### US-5: Mark Task Complete
**As a user, I want to toggle a task's completion status, so I can mark items as done or reopen them.**

## Functional Requirements

### FR-1: Task Creation
- System shall accept task title (1-200 characters, required)
- System shall accept task description (0-1000 characters, optional)
- System shall generate unique task ID (integer)
- System shall set initial status as "incomplete"
- System shall store task creation timestamp

### FR-2: Task Listing
- System shall display all tasks in numbered list format
- System shall show task ID, title, description, status, and creation date
- System shall use visual indicators for completion status (✓/✗)

### FR-3: Task Update
- System shall accept task ID as input
- System shall allow modification of title and/or description
- System shall validate task ID exists
- System shall update task timestamp on modification

### FR-4: Task Deletion
- System shall accept task ID as input
- System shall validate task ID exists
- System shall remove task from memory
- System shall confirm deletion to user

### FR-5: Task Completion Toggle
- System shall accept task ID as input
- System shall toggle completion status (complete ↔ incomplete)
- System shall update task timestamp on status change
- System shall provide confirmation message

### FR-6: User Interface
- System shall provide clear menu system with numbered options
- System shall display current task count
- System shall show usage instructions
- System shall handle invalid inputs gracefully

## Data Model

```python
class Task:
    id: int (unique identifier, auto-increment starting from 1)
    title: str (1-200 chars, required)
    description: str (0-1000 chars, optional)
    completed: bool (default: False)
    created_at: datetime
    updated_at: datetime
```

## Clarifications & Decisions

### CLR-001: Task ID Format
**Decision**: Auto-incrementing integers starting from 1 (1, 2, 3...)
**Rationale**: Simple, sequential numbering that's user-friendly
**Implementation**:
- First task created gets ID 1
- Second task gets ID 2
- IDs increment sequentially
- IDs never reused (deleting task 3, next task gets ID 4)

### CLR-002: Date Display Format
**Decision**: Full datetime format (YYYY-MM-DD HH:MM:SS)
**Rationale**: Precise timestamps for tracking
**Implementation**:
- Example: `2025-12-07 14:30:45`
- Use 24-hour format
- Include seconds for precision

### CLR-003: Menu Behavior
**Decision**: Auto-display menu after each operation
**Rationale**: Better user experience, no extra keystroke needed
**Implementation**:
- After adding task → Show menu automatically
- After completing task → Show menu automatically
- After any operation → Show menu automatically
- Clear screen before showing menu (optional, for cleaner UI)

## Non-Functional Requirements

### NFR-1: Usability
- Clear command-line interface with intuitive menu
- Helpful error messages for invalid inputs
- Minimal commands required per action

### NFR-2: Performance
- All operations complete within 1 second
- Support up to 1000 tasks in memory

### NFR-3: Maintainability
- Clean, readable Python code
- Proper docstrings for all functions
- Follow PEP 8 style guide

## Interface Specification

### Main Menu
```
=== Todo App (Phase I) ===
1. Add Task
2. List Tasks
3. Update Task
4. Delete Task
5. Mark Task Complete
6. Exit
```

### Commands
- `1` → Add new task
- `2` → List all tasks
- `3` → Update existing task
- `4` → Delete task
- `5` → Toggle task completion
- `6` → Exit application

## Acceptance Criteria

### AC-1: Task Creation
- [ ] User can add task with title only
- [ ] User can add task with title and description
- [ ] System validates title length (1-200 characters)
- [ ] System generates unique ID
- [ ] System sets initial status to incomplete

### AC-2: Task Listing
- [ ] System displays all tasks in numbered format
- [ ] System shows: ID, title, description, status, created date
- [ ] Completed tasks marked with ✓
- [ ] Incomplete tasks marked with ✗

### AC-3: Task Update
- [ ] User can update title of existing task
- [ ] User can update description of existing task
- [ ] System validates task ID exists before update
- [ ] System rejects invalid task ID with error message

### AC-4: Task Deletion
- [ ] User can delete task by ID
- [ ] System confirms deletion before removal
- [ ] System removes task from list
- [ ] System handles non-existent task ID gracefully

### AC-5: Task Completion
- [ ] User can mark task as complete
- [ ] User can mark task as incomplete
- [ ] System toggles status based on current state
- [ ] System updates completion indicator in list

### AC-6: Application Workflow
- [ ] Menu displays correctly on startup
- [ ] All menu options work as expected
- [ ] Invalid menu options show error message
- [ ] Application exits cleanly on option 6

## Out of Scope

- Persistent storage (data persists only in memory)
- User authentication
- Multi-user support
- Task priorities or tags
- Due dates or reminders
- Search or filter functionality
- Database integration

## Dependencies

- Python 3.13+
- UV package manager
- Claude Code
- Spec-Kit Plus

## Success Metrics

- All 5 Basic Level features implemented
- Console application runs without errors
- User can perform all CRUD operations
- Clean code following PEP 8 standards
- Complete specification files (this spec.md)

## Constraints

- Must use Spec-Driven Development
- No manual coding allowed
- Must use UV for Python environment
- Must include proper documentation
- All operations in-memory only

## Phase Connections

**Predecessor**: None (Starting phase)
**Successor**: Phase II - Web Application (will inherit data models and logic)

## Related Bonuses

- **Reusable Intelligence** (+200): Create Claude Code skills for task generation and code patterns
- **Cloud-Native Blueprints**: Not applicable to this phase

## Notes

- This is the foundation phase
- Data models established here will be reused in Phase II
- Focus on clean, maintainable code structure
- Prepare for migration to persistent storage in Phase II
