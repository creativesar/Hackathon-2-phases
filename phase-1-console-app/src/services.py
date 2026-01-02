"""Service layer for Todo Console Application

Provides business logic with input validation wrapping repository operations.
"""

from typing import List, Optional
from repository import TaskRepository
from models import Task


class TaskService:
    """Service layer for task business logic and validation.

    Wraps repository operations with additional validation and error handling.

    Attributes:
        repository (TaskRepository): Repository for task storage
        MAX_TITLE_LENGTH (int): Maximum allowed title length (200)
        MAX_DESC_LENGTH (int): Maximum allowed description length (1000)

    Example:
        >>> repo = TaskRepository()
        >>> service = TaskService(repo)
        >>> task = service.add_task("Buy groceries", "Milk, eggs")
        >>> assert task.id == 1
        >>> tasks = service.list_tasks()
        >>> assert len(tasks) == 1
    """

    MAX_TITLE_LENGTH: int = 200
    MAX_DESC_LENGTH: int = 1000

    def __init__(self, repository: TaskRepository) -> None:
        """Initialize service with repository instance."""
        self.repository = repository

    def _validate_title(self, title: str) -> None:
        """Validate task title.

        Args:
            title (str): Title to validate

        Raises:
            ValueError: If title is invalid (too short, too long)
        """
        if not title or len(title.strip()) < 1:
            raise ValueError(f"Title must be at least 1 character")
        if len(title) > self.MAX_TITLE_LENGTH:
            raise ValueError(f"Title cannot exceed {self.MAX_TITLE_LENGTH} characters")

    def _validate_description(self, description: str) -> None:
        """Validate task description.

        Args:
            description (str): Description to validate

        Raises:
            ValueError: If description is too long
        """
        if len(description) > self.MAX_DESC_LENGTH:
            raise ValueError(f"Description cannot exceed {self.MAX_DESC_LENGTH} characters")

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task after validation.

        Args:
            title (str): Task title (1-200 characters)
            description (str): Task description (0-1000 characters)

        Returns:
            Task: Created task object

        Raises:
            ValueError: If validation fails
        """
        self._validate_title(title)
        self._validate_description(description)
        return self.repository.create(title, description)

    def list_tasks(self) -> List[Task]:
        """List all tasks.

        Returns:
            List[Task]: List of all tasks (copy of repository list)
        """
        return self.repository.get_all()

    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Get a task by ID.

        Args:
            task_id (int): Task ID to search for

        Returns:
            Optional[Task]: Task object if found, None otherwise
        """
        return self.repository.get_by_id(task_id)

    def update_task(self, task_id: int, title: str = None, description: str = None) -> Task:
        """Update existing task after validation.

        Args:
            task_id (int): Task ID to update
            title (str): New title (optional)
            description (str): New description (optional)

        Returns:
            Task: Updated task object

        Raises:
            ValueError: If task not found or validation fails
        """
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        if title is not None:
            self._validate_title(title)
        if description is not None:
            self._validate_description(description)

        updated_task = self.repository.update(task_id, title, description)
        if updated_task is None:
            raise ValueError(f"Failed to update task with ID {task_id}")
        return updated_task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID.

        Args:
            task_id (int): Task ID to delete

        Returns:
            bool: True if deleted, False if not found

        Raises:
            ValueError: If task not found
        """
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        result = self.repository.delete(task_id)
        return result

    def mark_complete(self, task_id: int) -> Task:
        """Toggle task completion status.

        Args:
            task_id (int): Task ID to toggle

        Returns:
            Task: Updated task object

        Raises:
            ValueError: If task not found
        """
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        updated_task = self.repository.toggle_complete(task_id)
        if updated_task is None:
            raise ValueError(f"Failed to toggle completion for task {task_id}")
        return updated_task
