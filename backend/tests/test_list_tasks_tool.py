"""
T-323: Test Suite for list_tasks Tool

This module contains comprehensive tests for the list_tasks tool in the MCP server.
Tests cover valid inputs, validation errors, and edge cases.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from mcp_server import list_tasks_tool
from models import Task
from datetime import datetime


class MockSession:
    """Mock session for testing database operations"""

    def __init__(self, tasks=None):
        self.tasks = tasks or []
        self.closed = False

    def exec(self, query):
        # Mock query execution - return tasks that match the user_id
        class MockResult:
            def all(self):
                return self.tasks

            def filter(self, condition):
                # Simplified filter logic for testing
                return MockResult()

        return MockResult()

    def close(self):
        self.closed = True

    def get(self, model_class, obj_id):
        # For testing complete_task, delete_task, update_task
        for task in self.tasks:
            if hasattr(task, 'id') and task.id == obj_id:
                return task
        return None


@pytest.mark.asyncio
async def test_list_tasks_all_status():
    """Test list_tasks with 'all' status filter (default)"""
    # Arrange
    user_id = "test_user_123"
    status = "all"

    # Create mock tasks
    task1 = Task(id=1, user_id=user_id, title="Pending Task", description="A pending task", completed=False)
    task2 = Task(id=2, user_id=user_id, title="Completed Task", description="A completed task", completed=True)

    mock_session = MockSession(tasks=[task1, task2])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 2
        assert result[0]["title"] == "Pending Task"
        assert result[0]["completed"] is False
        assert result[1]["title"] == "Completed Task"
        assert result[1]["completed"] is True
        assert mock_session.closed is True


@pytest.mark.asyncio
async def test_list_tasks_default_all():
    """Test list_tasks with default 'all' status"""
    # Arrange
    user_id = "test_user_123"

    # Create mock tasks
    task1 = Task(id=1, user_id=user_id, title="Pending Task", description="A pending task", completed=False)
    task2 = Task(id=2, user_id=user_id, title="Completed Task", description="A completed task", completed=True)

    mock_session = MockSession(tasks=[task1, task2])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id)  # No status parameter

        # Assert
        assert len(result) == 2
        assert result[0]["title"] == "Pending Task"
        assert result[0]["completed"] is False
        assert result[1]["title"] == "Completed Task"
        assert result[1]["completed"] is True


@pytest.mark.asyncio
async def test_list_tasks_pending_only():
    """Test list_tasks with 'pending' status filter"""
    # Arrange
    user_id = "test_user_123"
    status = "pending"

    # Create mock tasks
    task1 = Task(id=1, user_id=user_id, title="Pending Task", description="A pending task", completed=False)
    task2 = Task(id=2, user_id=user_id, title="Completed Task", description="A completed task", completed=True)
    task3 = Task(id=3, user_id=user_id, title="Another Pending Task", description="Another pending task", completed=False)

    mock_session = MockSession(tasks=[task1, task2, task3])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 2  # Only pending tasks
        for task in result:
            assert task["completed"] is False


@pytest.mark.asyncio
async def test_list_tasks_completed_only():
    """Test list_tasks with 'completed' status filter"""
    # Arrange
    user_id = "test_user_123"
    status = "completed"

    # Create mock tasks
    task1 = Task(id=1, user_id=user_id, title="Pending Task", description="A pending task", completed=False)
    task2 = Task(id=2, user_id=user_id, title="Completed Task", description="A completed task", completed=True)
    task3 = Task(id=3, user_id=user_id, title="Another Completed Task", description="Another completed task", completed=True)

    mock_session = MockSession(tasks=[task1, task2, task3])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 2  # Only completed tasks
        for task in result:
            assert task["completed"] is True


@pytest.mark.asyncio
async def test_list_tasks_empty_result():
    """Test list_tasks when no tasks match the filter"""
    # Arrange
    user_id = "test_user_123"
    status = "completed"

    # Create mock tasks - all pending
    task1 = Task(id=1, user_id=user_id, title="Pending Task", description="A pending task", completed=False)
    task2 = Task(id=2, user_id=user_id, title="Another Pending Task", description="Another pending task", completed=False)

    mock_session = MockSession(tasks=[task1, task2])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 0  # No completed tasks


@pytest.mark.asyncio
async def test_list_tasks_wrong_user():
    """Test list_tasks with different user_id"""
    # Arrange
    user_id = "test_user_123"
    other_user_id = "other_user_456"
    status = "all"

    # Create mock tasks for other user
    task1 = Task(id=1, user_id=other_user_id, title="Other User Task", description="A task for another user", completed=False)
    task2 = Task(id=2, user_id=other_user_id, title="Another Other User Task", description="Another task for another user", completed=True)

    mock_session = MockSession(tasks=[task1, task2])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 0  # No tasks for this user


@pytest.mark.asyncio
async def test_list_tasks_invalid_status_error():
    """Test list_tasks with invalid status - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    status = "invalid_status"

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await list_tasks_tool(user_id, status)

    assert "Invalid status. Use 'all', 'pending', or 'completed'" in str(exc_info.value)


@pytest.mark.asyncio
async def test_list_tasks_status_case_sensitive():
    """Test list_tasks with case-sensitive status - should raise ValueError"""
    # Arrange
    user_id = "test_user_123"
    status = "PENDING"  # Uppercase, should be lowercase

    # Act & Assert
    with pytest.raises(ValueError) as exc_info:
        await list_tasks_tool(user_id, status)

    assert "Invalid status. Use 'all', 'pending', or 'completed'" in str(exc_info.value)


@pytest.mark.asyncio
async def test_list_tasks_database_error():
    """Test list_tasks when database operations fail"""
    # Arrange
    user_id = "test_user_123"
    status = "all"

    # Mock the database session generator to raise an exception
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [None]  # This will cause an error

        # Replace exec method to raise an exception
        original_next = next
        def mock_next(session_generator):
            session = original_next(session_generator)

            class ErrorSession:
                def exec(self, query):
                    raise IntegrityError("Mock database error", {}, {})

                def close(self):
                    pass

            return ErrorSession()

        with patch('builtins.next', side_effect=mock_next):
            # Act & Assert
            with pytest.raises(IntegrityError):
                await list_tasks_tool(user_id, status)


@pytest.mark.asyncio
async def test_list_tasks_single_task():
    """Test list_tasks with a single task"""
    # Arrange
    user_id = "test_user_123"
    status = "all"

    # Create mock task
    task1 = Task(id=1, user_id=user_id, title="Single Task", description="A single task", completed=False)

    mock_session = MockSession(tasks=[task1])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 1
        assert result[0]["id"] == 1
        assert result[0]["title"] == "Single Task"
        assert result[0]["description"] == "A single task"
        assert result[0]["completed"] is False
        assert "created_at" in result[0]


@pytest.mark.asyncio
async def test_list_tasks_no_description():
    """Test list_tasks with tasks that have no description"""
    # Arrange
    user_id = "test_user_123"
    status = "all"

    # Create mock task with no description
    task1 = Task(id=1, user_id=user_id, title="Task Without Description", description=None, completed=False)

    mock_session = MockSession(tasks=[task1])

    # Mock the database session generator
    with patch('mcp_server.get_session') as mock_get_session:
        mock_get_session.return_value = [mock_session]

        # Act
        result = await list_tasks_tool(user_id, status)

        # Assert
        assert len(result) == 1
        assert result[0]["id"] == 1
        assert result[0]["title"] == "Task Without Description"
        assert result[0]["description"] is None
        assert result[0]["completed"] is False


if __name__ == "__main__":
    pytest.main([__file__])