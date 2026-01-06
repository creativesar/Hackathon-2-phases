"""
T-323: Test Suite for update_task Tool

This module contains comprehensive tests for the update_task tool in the MCP server.
Tests cover valid inputs, validation errors, and edge cases.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from sqlmodel import Session
from sqlalchemy.exc import IntegrityError
from mcp_server import update_task_tool
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
async def test_update_task_title_success():
    """Test update_task with new title - should update the task title"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "Updated Task Title"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, title=new_title)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == new_title

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == new_title
        assert updated_task.description == "Original description"  # Should remain unchanged


@pytest.mark.asyncio
async def test_update_task_description_success():
    """Test update_task with new description - should update the task description"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_description = "Updated description for the task"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, description=new_description)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == "Original Task"  # Should remain unchanged

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == "Original Task"
        assert updated_task.description == new_description


@pytest.mark.asyncio
async def test_update_task_both_title_and_description():
    """Test update_task with both new title and description"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "Updated Task Title"
    new_description = "Updated description for the task"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, title=new_title, description=new_description)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == new_title

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == new_title
        assert updated_task.description == new_description


@pytest.mark.asyncio
async def test_update_task_no_updates():
    """Test update_task with no title or description changes - should still return success"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id)  # No title or description provided

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == "Original Task"

        # Verify the task was not modified in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == "Original Task"
        assert updated_task.description == "Original description"


@pytest.mark.asyncio
async def test_update_task_not_found_error():
    """Test update_task with non-existent task ID - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 999  # Non-existent task ID
    new_title = "Updated Task Title"

    mock_session = MockSession(tasks=[])  # Empty task list

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await update_task_tool(user_id, task_id, title=new_title)

        assert "Task not found" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_task_access_denied():
    """Test update_task with wrong user - should raise ValueError"""
    # Arrange
    user_id = "different_user_456"  # Different user
    task_id = 1
    new_title = "Updated Task Title"
    original_user_id = "original_user_123"

    # Create mock task owned by different user
    task = Task(id=task_id, user_id=original_user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await update_task_tool(user_id, task_id, title=new_title)

        assert "Access denied" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_task_empty_title_error():
    """Test update_task with empty title - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = ""  # Empty title

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await update_task_tool(user_id, task_id, title=new_title)

        assert "Title must be 1-200 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_task_long_title_error():
    """Test update_task with title that exceeds 200 characters - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "A" * 201  # 201 characters, exceeding the limit

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await update_task_tool(user_id, task_id, title=new_title)

        assert "Title must be 1-200 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_task_long_description_error():
    """Test update_task with description that exceeds 1000 characters - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_description = "A" * 1001  # 1001 characters, exceeding the limit

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await update_task_tool(user_id, task_id, description=new_description)

        assert "Description cannot exceed 1000 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_task_database_error():
    """Test update_task when database operations fail"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "Updated Task Title"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

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
            await update_task_tool(user_id, task_id, title=new_title)


@pytest.mark.asyncio
async def test_update_task_edge_case_very_long_title():
    """Test update_task with title at the exact character limit (200)"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "A" * 200  # Exactly 200 characters

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, title=new_title)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == new_title
        assert len(result["title"]) == 200

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == new_title
        assert len(updated_task.title) == 200


@pytest.mark.asyncio
async def test_update_task_edge_case_long_description_at_limit():
    """Test update_task with description at the exact character limit (1000)"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_description = "A" * 1000  # Exactly 1000 characters

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, description=new_description)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == "Original Task"

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.description == new_description
        assert len(updated_task.description) == 1000


@pytest.mark.asyncio
async def test_update_task_special_characters():
    """Test update_task with special characters in title and description"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "Updated Task with Special Ch@r$!"
    new_description = "Updated description with special characters: @#$%^&*()_+-=[]{}|;:,.<>?"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, title=new_title, description=new_description)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == new_title

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == new_title
        assert updated_task.description == new_description


@pytest.mark.asyncio
async def test_update_task_unicode_characters():
    """Test update_task with Unicode characters"""
    # Arrange
    user_id = "test_user_123"
    task_id = 1
    new_title = "Updated Task with Unicode: 🚀 α β γ δ"
    new_description = "Updated Unicode description: café naïve résumé 你好"

    # Create mock task
    task = Task(id=task_id, user_id=user_id, title="Original Task", description="Original description", completed=False)

    mock_session = MockSession(tasks=[task])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await update_task_tool(user_id, task_id, title=new_title, description=new_description)

        # Assert
        assert result["task_id"] == task_id
        assert result["status"] == "updated"
        assert result["title"] == new_title

        # Verify the task was updated in the mock session
        updated_task = mock_session.get(Task, task_id)
        assert updated_task is not None
        assert updated_task.title == new_title
        assert updated_task.description == new_description


if __name__ == "__main__":
    pytest.main([__file__])