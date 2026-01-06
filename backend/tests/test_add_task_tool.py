"""
T-323: Test Suite for add_task Tool

This module contains comprehensive tests for the add_task tool in the MCP server.
Tests cover valid inputs, validation errors, and edge cases.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from sqlmodel import Session, SQLModel
from sqlalchemy.exc import IntegrityError
from mcp_server import add_task_tool
from models import Task


class MockSession:
    """Mock session for testing database operations"""

    def __init__(self):
        self.added_objects = []
        self.committed = False
        self.closed = False
        self.tasks = []
        self.next_id = 1

    def add(self, obj):
        self.added_objects.append(obj)
        # Simulate setting an ID if it's a task
        if hasattr(obj, 'title'):
            obj.id = self.next_id
            self.next_id += 1
            self.tasks.append(obj)

    def commit(self):
        self.committed = True

    def refresh(self, obj):
        # In real scenario, this would refresh the object from DB
        pass

    def close(self):
        self.closed = True

    def get(self, model_class, obj_id):
        # For testing complete_task, delete_task, update_task
        for task in self.tasks:
            if hasattr(task, 'id') and task.id == obj_id:
                return task
        return None

    def exec(self, query):
        # Mock query execution
        class MockResult:
            def all(self):
                return self.tasks
        return MockResult()


@pytest.mark.asyncio
async def test_add_task_valid_input():
    """Test add_task with valid input parameters"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task"
    description = "Test Description"

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title, description)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title
        assert "task_id" in result
        assert isinstance(result["task_id"], int)

        # Verify session operations
        assert len(mock_session.added_objects) == 1
        assert mock_session.committed is True
        assert mock_session.closed is True

        # Verify the task object
        task = mock_session.added_objects[0]
        assert task.user_id == user_id
        assert task.title == title
        assert task.description == description


@pytest.mark.asyncio
async def test_add_task_without_description():
    """Test add_task with only required parameters (no description)"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task"

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title
        assert "task_id" in result
        assert isinstance(result["task_id"], int)

        # Verify the task object
        task = mock_session.added_objects[0]
        assert task.user_id == user_id
        assert task.title == title
        assert task.description is None


@pytest.mark.asyncio
async def test_add_task_empty_title_error():
    """Test add_task with empty title - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    title = ""
    description = "Test Description"

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await add_task_tool(user_id, title, description)

    assert "Title must be 1-200 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_add_task_missing_title_error():
    """Test add_task with None title - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    title = None
    description = "Test Description"

    # Act & Assert
    with pytest.raises(TypeError):  # This will likely be a TypeError due to type annotation
        await add_task_tool(user_id, title, description)


@pytest.mark.asyncio
async def test_add_task_short_title_error():
    """Test add_task with title that's too short (empty) - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    title = ""
    description = "Test Description"

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await add_task_tool(user_id, title, description)

    assert "Title must be 1-200 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_add_task_long_title_error():
    """Test add_task with title that exceeds 200 characters - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    title = "A" * 201  # 201 characters, exceeding the limit
    description = "Test Description"

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await add_task_tool(user_id, title, description)

    assert "Title must be 1-200 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_add_task_long_description_error():
    """Test add_task with description that exceeds 1000 characters - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task"
    description = "A" * 1001  # 1001 characters, exceeding the limit

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await add_task_tool(user_id, title, description)

    assert "Description cannot exceed 1000 characters" in str(exc_info.value)


@pytest.mark.asyncio
async def test_add_task_database_error():
    """Test add_task when database operations fail"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task"
    description = "Test Description"

    # Create a mock session that raises an exception
    class FailingMockSession(MockSession):
        def commit(self):
            raise IntegrityError("Mock database error", {}, {})

    failing_session = FailingMockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [failing_session]

        # Act & Assert
        with pytest.raises(IntegrityError):
            await add_task_tool(user_id, title, description)


@pytest.mark.asyncio
async def test_add_task_edge_case_very_long_title():
    """Test add_task with title at the exact character limit (200)"""
    # Arrange
    user_id = "test_user_123"
    title = "A" * 200  # Exactly 200 characters
    description = "Test Description"

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title, description)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title
        assert len(result["title"]) == 200


@pytest.mark.asyncio
async def test_add_task_edge_case_long_description_at_limit():
    """Test add_task with description at the exact character limit (1000)"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task"
    description = "A" * 1000  # Exactly 1000 characters

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title, description)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title
        assert len(result["title"]) == len(title)
        # Verify the task object
        task = mock_session.added_objects[0]
        assert task.description == description
        assert len(task.description) == 1000


@pytest.mark.asyncio
async def test_add_task_special_characters():
    """Test add_task with special characters in title and description"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task with Special Ch@r$!"
    description = "Description with special characters: @#$%^&*()_+-=[]{}|;:,.<>?"

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title, description)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title


@pytest.mark.asyncio
async def test_add_task_unicode_characters():
    """Test add_task with Unicode characters"""
    # Arrange
    user_id = "test_user_123"
    title = "Test Task with Unicode: 🚀 α β γ δ"
    description = "Unicode description: café naïve résumé 你好"

    mock_session = MockSession()

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await add_task_tool(user_id, title, description)

        # Assert
        assert result["status"] == "created"
        assert result["title"] == title


if __name__ == "__main__":
    pytest.main([__file__])