"""
T-323: Test Suite for delete_task Tool

This module contains comprehensive tests for the delete_task tool in the MCP server.
Tests cover valid inputs, validation errors, and edge cases.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from sqlmodel import Session
from sqlalchemy.exc import IntegrityError
from mcp_server import delete_task_tool
from models import Task
from datetime import datetime


class MockSession:
    """Mock session for testing database operations"""

    def __init__(self, tasks=None):
        self.tasks = tasks or []
        self.closed = False
        self.deleted_objects = []

    def get(self, model_class, obj_id):
        # Find task by ID
        for task in self.tasks:
            if task.id == obj_id:
                return task
        return None

    def close(self):
        self.closed = True

    def delete(self, obj):
        # Remove the object from tasks list
        self.deleted_objects.append(obj)
        self.tasks = [task for task in self.tasks if task.id != obj.id]

    def commit(self):
        pass


@pytest.mark.asyncio
async def test_delete_task_success():
    """Test delete_task with valid parameters - should delete the task"""
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
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == "Test Task"

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None

        # Verify the task was marked for deletion
        assert len(mock_session.deleted_objects) == 1
        assert mock_session.deleted_objects[0].id == task_id


@pytest.mark.asyncio
async def test_delete_task_not_found_error():
    """Test delete_task with non-existent task ID - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 999  # Non-existent task ID

    mock_session = MockSession(tasks=[])  # Empty task list

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await delete_task_tool(user_id, task_id)

        assert "Task not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_delete_task_access_denied():
    """Test delete_task with wrong user - should raise ValueError"""
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
            await delete_task_tool(user_id, task_id)

        assert "Access denied" in str(exc_info.value)


@pytest.mark.asyncio
async def test_delete_task_database_error():
    """Test delete_task when database operations fail"""
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
            await delete_task_tool(user_id, task_id)


@pytest.mark.asyncio
async def test_delete_task_with_completed_task():
    """Test delete_task with an already completed task - should still delete"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task that's already completed
    task = Task(id=task_id, user_id=user_id, title="Completed Task", description="A completed task", completed=True)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == "Completed Task"

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None


@pytest.mark.asyncio
async def test_delete_task_valid_id_zero():
    """Test delete_task with task ID of 0 - should raise ValueError as it's not found"""
    # Arrange
    user_id = "test_user_123"
    task_id = 0  # Edge case: zero ID

    mock_session = MockSession(tasks=[])  # No tasks

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await delete_task_tool(user_id, task_id)

        assert "Task not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_delete_task_with_special_characters():
    """Test delete_task with task containing special characters in title/description"""
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
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == "Test Task with Special Ch@r$!"

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None


@pytest.mark.asyncio
async def test_delete_task_unicode_characters():
    """Test delete_task with task containing Unicode characters"""
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
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == "Test Task with Unicode: 🚀 α β γ"

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None


@pytest.mark.asyncio
async def test_delete_task_empty_title():
    """Test delete_task with task that has an empty title"""
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
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == ""  # Title is empty but still returned

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None


@pytest.mark.asyncio
async def test_delete_task_no_description():
    """Test delete_task with task that has no description"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task with no description
    task = Task(id=task_id, user_id=user_id, title="Test Task", description=None, completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await delete_task_tool(user_id, task_id)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "deleted"
        assert result["title"] == "Test Task"

        # Verify the task was removed from the mock session
        deleted_task = mock_session.get(Task, task_id)
        assert deleted_task is None


if __name__ == "__main__":
    pytest.main([__file__])