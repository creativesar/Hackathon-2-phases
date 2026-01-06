"""
T-323: Test Suite for complete_task Tool

This module contains comprehensive tests for the complete_task tool in the MCP server.
Tests cover valid inputs, validation errors, and edge cases.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from sqlmodel import Session
from sqlalchemy.exc import IntegrityError
from mcp_server import complete_task_tool
from models import Task
from datetime import datetime


class MockSession:
    """Mock session for testing database operations"""

    def __init__(self, tasks=None):
        self.tasks = tasks or []
        self.closed = False

    def get(self, model_class, obj_id):
        # Find task by ID
        for task in self.tasks:
            if task.id == obj_id:
                return task
        return None

    def close(self):
        self.closed = True

    def add(self, obj):
        # Update the task in the list if it exists
        for i, task in enumerate(self.tasks):
            if task.id == obj.id:
                self.tasks[i] = obj
                break

    def commit(self):
        pass

    def refresh(self, obj):
        # Refresh object from DB (in mock, just pass)
        pass


@pytest.mark.asyncio
async def test_complete_task_success():
    """Test complete_task with valid parameters - should toggle task to completed"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Test Task", description="A test task", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await complete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "completed"
        assert result["title"] == "Test Task"

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.completed is True


@pytest.mark.asyncio
async def test_complete_task_already_completed():
    """Test complete_task with an already completed task - should toggle to pending"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task that's already completed
    task = Task(id=task_id, user_id=user_id, title="Test Task", description="A test task", completed=True)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await complete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "pending"  # Should toggle to pending
        assert result["title"] == "Test Task"

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.completed is False


@pytest.mark.asyncio
async def test_complete_task_not_found_error():
    """Test complete_task with non-existent task ID - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 999  # Non-existent task ID

    mock_session = MockSession(tasks=[])  # Empty task list

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await complete_task_tool(user_id, task_id)

        assert "Task not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_complete_task_access_denied():
    """Test complete_task with wrong user - should raise ValueError"""
    # Arrange
    user_id = "different_user_456"  # Different user
    task_id = 1
    original_user_id = "original_user_123"

    # Create mock task owned by different user
    task = Task(id=task_id, user_id=original_user_id, title="Test Task", description="A test task", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await complete_task_tool(user_id, task_id)

        assert "Access denied" in str(exc_info.value)


@pytest.mark.asyncio
async def test_complete_task_database_error():
    """Test complete_task when database operations fail"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Test Task", description="A test task", completed=False)

    # Create a mock session that raises an exception during commit
    class FailingMockSession(MockSession):
        def commit(self):
            raise IntegrityError("Mock database error", {}, {})

    failing_session = FailingMockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [failing_session]

        # Act & Assert
        with pytest.raises(IntegrityError):
            await complete_task_tool(user_id, task_id)


@pytest.mark.asyncio
async def test_complete_task_valid_id_zero():
    """Test complete_task with task ID of 0 - should raise ValueError as it's not found"""
    # Arrange
    user_id = "test_user_123"
    task_id = 0  # Edge case: zero ID

    mock_session = MockSession(tasks=[])  # No tasks

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await complete_task_tool(user_id, task_id)

        assert "Task not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_complete_task_with_special_characters():
    """Test complete_task with task containing special characters in title/description"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task with special characters
    task = Task(
        id=task_id,
        user_id=user_id,
        title="Test Task with Special Ch@r$!",
        description="Description with special characters: @#$%^&*()",
        completed=False
    )

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await complete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "completed"
        assert result["title"] == "Test Task with Special Ch@r$!"

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.completed is True


@pytest.mark.asyncio
async def test_complete_task_unicode_characters():
    """Test complete_task with task containing Unicode characters"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task with Unicode characters
    task = Task(
        id=task_id,
        user_id=user_id,
        title="Test Task with Unicode: 🚀 α β γ",
        description="Unicode description: café naïve résumé 你好",
        completed=False
    )

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await complete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "completed"
        assert result["title"] == "Test Task with Unicode: 🚀 α β γ"

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.completed is True


@pytest.mark.asyncio
async def test_complete_task_empty_title():
    """Test complete_task with task that has an empty title"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task with empty title (though this shouldn't normally happen due to validation)
    task = Task(id=task_id, user_id=user_id, title="", description="A test task", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await complete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "completed"
        assert result["title"] == ""  # Title is empty but still returned

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.completed is True


if __name__ == "__main__":
    pytest.main([__file__])