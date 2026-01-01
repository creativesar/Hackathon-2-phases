"""Data models for Todo Console Application

Contains the Task dataclass for todo item management.
"""

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Task:
    """Represents a todo task with all required attributes.

    Attributes:
        id (int): Unique identifier, auto-incrementing from 1
        title (str): Task title, 1-200 characters, required
        description (str): Task description, 0-1000 characters, optional
        completed (bool): Task completion status, defaults to False
        created_at (datetime): Task creation timestamp
        updated_at (datetime): Task last update timestamp

    Example:
        >>> task = Task(id=1, title="Buy groceries", description="Milk, eggs")
        >>> print(task.id)
        1
        >>> print(task.created_at.strftime("%Y-%m-%d %H:%M:%S"))
        2025-12-07 14:30:45
    """

    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self) -> None:
        """Validate task attributes after initialization."""
        # Validate title length (1-200 characters)
        if not self.title or len(self.title) < 1:
            raise ValueError("Title must be at least 1 character")
        if len(self.title) > 200:
            raise ValueError("Title cannot exceed 200 characters")

        # Validate description length (0-1000 characters)
        if len(self.description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")

    def __str__(self) -> str:
        """Return a human-readable string representation of the task.

        Format: [✓/✗] Task Title (description) - Created at YYYY-MM-DD

        Returns:
            str: Formatted task string
        """
        status_icon = "✓" if self.completed else "✗"
        date_str = self.created_at.strftime("%Y-%m-%d %H:%M:%S")

        if self.description:
            return f"{status_icon} {self.id}. {self.title} ({self.description}) - {date_str}"
        return f"{status_icon} {self.id}. {self.title} - {date_str}"
