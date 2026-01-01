"""Repository layer for in-memory task storage

Manages task persistence with auto-incrementing IDs and CRUD operations.
"""

from typing import List, Optional
from datetime import datetime
from models import Task


class TaskRepository:
    """In-memory repository for managing Task objects.

    Attributes:
        tasks (List[Task]): List of all stored tasks
        next_id (int): Next task ID to assign (auto-incrementing from 1)

    Example:
        >>> repo = TaskRepository()
        >>> task = repo.create("Buy groceries", "Milk, eggs, bread")
        >>> assert task.id == 1
        >>> assert repo.next_id == 2
        >>> all_tasks = repo.get_all()
        >>> len(all_tasks) == 1
    """

    def __init__(self) -> None:
        """Initialize empty task list and next ID counter."""
        self.tasks: List[Task] = []
        self.next_id: int = 1

    def create(self, title: str, description: str = "") -> Task:
        """Create a new task with auto-incremented ID.

        Args:
            title (str): Task title (1-200 characters)
            description (str): Task description (0-1000 characters), optional

        Returns:
            Task: Created task object with generated ID

        Raises:
            ValueError: If validation fails (handled by Task model)
        """
        task_id = self.next_id
        self.next_id += 1

        task = Task(
            id=task_id,
            title=title,
            description=description,
            completed=False,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        self.tasks.append(task)
        return task

    def get_all(self) -> List[Task]:
        """Return a copy of all tasks.

        Returns:
            List[Task]: Copy of tasks list (prevents external modification)
        """
        return self.tasks.copy()

    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Find and return task by ID.

        Args:
            task_id (int): Task ID to search for

        Returns:
            Optional[Task]: Task object if found, None otherwise
        """
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def update(self, task_id: int, title: str = None, description: str = None) -> Optional[Task]:
        """Update task title and/or description.

        Args:
            task_id (int): Task ID to update
            title (str): New title (optional)
            description (str): New description (optional)

        Returns:
            Optional[Task]: Updated task if found, None otherwise
        """
        task = self.get_by_id(task_id)
        if task is None:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        task.updated_at = datetime.now()
        return task

    def delete(self, task_id: int) -> bool:
        """Delete task by ID.

        Args:
            task_id (int): Task ID to delete

        Returns:
            bool: True if task was deleted, False if not found
        """
        task_index = None
        for i, task in enumerate(self.tasks):
            if task.id == task_id:
                task_index = i
                break

        if task_index is not None:
            del self.tasks[task_index]
            return True
        return False

    def toggle_complete(self, task_id: int) -> Optional[Task]:
        """Toggle task completion status.

        Args:
            task_id (int): Task ID to toggle

        Returns:
            Optional[Task]: Updated task if found, None otherwise
        """
        task = self.get_by_id(task_id)
        if task is None:
            return None

        task.completed = not task.completed
        task.updated_at = datetime.now()
        return task
