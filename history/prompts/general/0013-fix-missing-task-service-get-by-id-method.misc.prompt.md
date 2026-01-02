---
id: "0013"
title: "Fix missing TaskService.get_by_id method"
stage: "misc"
date_iso: "2026-01-02"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "User via CLI test"
command: "uv run python -m src.main (tested Update/Delete features)"
labels: ["bugfix", "phase-1-console-app", "task-service"]
links: []
files_yaml:
  - "src/services.py"
tests_yaml:
  - "Direct Python test of TaskService operations"
---
# PHR: Fix missing TaskService.get_by_id method

## Prompt
(User ran console app and encountered errors on Update/Delete/Mark Complete operations):
```
Unexpected error: 'TaskService' object has no attribute 'get_by_id'
```

## Response
Identified that `main.py` handlers call `service.get_by_id()` at lines 163 and 218, but `TaskService` class did not expose this method - only `TaskRepository` had it.

Added the missing method to `src/services.py`:
```python
def get_by_id(self, task_id: int) -> Optional[Task]:
    """Get a task by ID."""
    return self.repository.get_by_id(task_id)
```

Verified all operations work:
- get_by_id ✓
- update_task ✓
- mark_complete ✓
- delete_task ✓

## Outcome
Bug fixed - all TaskService CRUD operations now functional.
