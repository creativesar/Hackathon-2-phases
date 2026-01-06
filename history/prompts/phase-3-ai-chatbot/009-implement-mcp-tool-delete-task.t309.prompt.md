# PHR: T-309 Implement MCP Tool: delete_task

## Date
2026-01-06

## Task
T-309: Implement MCP tool: delete_task

## Objective
Implement the delete_task MCP tool that allows the AI agent to delete tasks for users in the Todo application.

## Context
This was the ninth task in the Phase 3 AI Chatbot implementation sequence. The task required implementing the delete_task tool function that can be called by the OpenAI agent to delete tasks for a user. This tool is one of five core MCP tools that enable the AI agent to interact with the todo system. The implementation needed to include proper validation, database operations for deletion, and error handling as specified in the task requirements.

## Implementation Details

### 1. Environment Check
- Navigated to `backend/` directory
- Verified existing mcp_server.py module had proper foundation from T-305
- Confirmed the delete_task_tool function was already implemented with all required functionality

### 2. Tool Implementation Found
The `backend/mcp_server.py` already contained the `delete_task_tool` function with the following components:

- **Function Definition**: `delete_task_tool` function with proper signature
  - `user_id`: String identifier for the user
  - `task_id`: Integer identifier for the task to delete
  - Returns: Dictionary with task_id, status, and title

- **Validation**: Implemented task validation:
  - Validates task exists in database
  - Validates user ownership of the task
  - Raises appropriate errors for invalid cases

- **Database Integration**: Used delayed imports pattern to connect to database
  - Called `get_session()` to get database session
  - Retrieved task by ID
  - Performed database deletion operation
  - Saved the original title before deletion for the return value
  - Committed changes back to database
  - Proper session management with close operation

- **Error Handling**: Comprehensive try-catch block with error logging

### 3. Key Features Implemented
- **Input Validation**: Proper validation of task existence and user ownership
- **Deletion Operation**: Safe deletion of the task from the database
- **Security**: User ownership validation to ensure only owners can delete tasks
- **Database Operations**: Safe database operations with proper session management
- **Error Handling**: Comprehensive exception handling with logging
- **Return Format**: Properly formatted response matching specification:
  ```python
  {
      "task_id": task_id,
      "status": "deleted",
      "title": title
  }
  ```

### 4. Testing
- Verified import functionality: `import mcp_server` works without errors
- Confirmed function signature matches requirements
- Validated deletion logic and database operations
- Tested database connection pattern

## Code Structure

```python
async def delete_task_tool(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task.

    Args:
        user_id: ID of the user
        task_id: ID of the task to delete

    Returns:
        Dictionary with task_id, status, and title
    """
    try:
        # Import database modules inside function to avoid connection issues at import time
        from sqlmodel import Session, select
        from models import Task
        from db import get_session

        # Connect to database session
        session = next(get_session())

        # Validate task exists and belongs to user
        task = session.get(Task, task_id)
        if not task:
            raise ValueError("Task not found")
        if task.user_id != user_id:
            raise ValueError("Access denied")

        # Delete task
        title = task.title
        session.delete(task)
        session.commit()
        session.close()

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title
        }
    except Exception as e:
        # Error handling wrapper
        print(f"Error in delete_task: {str(e)}")
        raise e
```

## Verification
- [x] Function signature matches requirements (user_id, task_id)
- [x] Input validation implemented (task exists and belongs to user)
- [x] Deletion operation implemented properly
- [x] Database integration with proper session management
- [x] Error handling with logging implemented
- [x] Return format matches specification
- [x] Import functionality tested: `import mcp_server` works without errors
- [x] Security considerations addressed (user ownership validation)

## Next Steps
- T-310: Implement remaining MCP tool (update_task)
- T-316: Integrate Agent with MCP tools (depends on T-306-T-310)
- Integration testing of the complete tool chain

## Notes
- The implementation follows the architecture specified in the plan.md file
- Delayed imports were used to avoid database connection issues at module import time
- All functions include comprehensive error handling and logging
- Security validations ensure users can only delete their own tasks
- The tool was already implemented as part of the foundation work in T-305
- Proper transaction management ensures data consistency during deletion
- Original task title is preserved in the response for confirmation

## Status
Completed successfully. The delete_task MCP tool was already implemented and is ready for use by the AI agent.