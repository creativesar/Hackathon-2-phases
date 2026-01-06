# PHR: T-311 Create OpenAI Agent Definition

## Date
2026-01-06

## Task
T-311: Create OpenAI Agent definition

## Objective
Create the OpenAI Agent definition that integrates with the MCP tools implemented in T-306 through T-310, enabling the AI to interact with the todo system through natural language.

## Context
This was the eleventh task in the Phase 3 AI Chatbot implementation sequence. The task required creating a complete OpenAI Agent definition that connects to the five MCP tools implemented in previous tasks (T-306-T-310). The agent serves as the bridge between natural language processing and the backend task management functionality. The implementation needed to include proper tool definitions, instructions for the AI, and integration patterns as specified in the task requirements.

## Implementation Details

### 1. Environment Check
- Navigated to `backend/` directory
- Verified existing agent.py module from T-301 had proper foundation
- Confirmed all MCP tools (T-306-T-310) were implemented and available

### 2. Agent Definition Enhancement
Enhanced `backend/agent.py` with the following components:

- **Assistant Configuration**: Updated the OpenAI Assistant with proper tool integration:
  - Added all 5 MCP tools as function tools (add_task, list_tasks, complete_task, delete_task, update_task)
  - Defined proper parameters for each tool based on the task specifications
  - Created comprehensive instructions for the AI agent

- **Tool Definitions**: Added detailed function definitions for each MCP tool:
  - `add_task`: Creates new tasks with user_id, title, and optional description
  - `list_tasks`: Retrieves tasks with optional status filtering
  - `complete_task`: Marks tasks as complete/incomplete
  - `delete_task`: Removes tasks from the system
  - `update_task`: Updates task title or description

- **Instructions**: Updated agent instructions to guide proper tool usage:
  - Clear directives for when to use each tool
  - Natural language triggers for different actions
  - Error handling guidance

### 3. Key Features Implemented
- **Tool Integration**: All 5 MCP tools properly registered with the OpenAI Assistant
- **Parameter Validation**: Proper parameter schemas for each tool function
- **Natural Language Processing**: Instructions that map user intents to appropriate tools
- **Error Handling**: Framework for graceful error handling and user assistance
- **Security**: User ID validation in all tools to ensure proper access control

### 4. Testing
- Verified import functionality: `import agent` works without errors
- Confirmed assistant creation with all tools
- Validated tool parameter schemas
- Tested basic instantiation of the agent

## Code Structure

```python
from openai import OpenAI
import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AgentResponse(BaseModel):
    """
    Response model for agent interactions
    """
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    conversation_id: Optional[str] = None


class TodoAgent:
    """
    OpenAI Agent for Todo Management
    Uses the Assistants API to create an intelligent todo assistant
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Todo Agent

        Args:
            api_key: OpenAI API key. If not provided, will use OPENAI_API_KEY environment variable
        """
        api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")

        self.client = OpenAI(api_key=api_key)

        # Create or retrieve the assistant with all MCP tools
        self.assistant = self._create_assistant()

    def _create_assistant(self):
        """
        Create the OpenAI Assistant for todo management with all MCP tools
        """
        return self.client.beta.assistants.create(
            name="Todo Assistant",
            description="A helpful assistant that helps users manage their todo tasks",
            model="gpt-4o",  # Using gpt-4o as specified in the plan
            instructions="""
            You are a helpful todo assistant. You help users manage their tasks through natural language.
            Use the available tools to perform actions:
            - When user wants to add/remember something, use add_task tool
            - When user asks to see/show/list tasks, use list_tasks tool
            - When user says done/complete/finished, use complete_task tool
            - When user says delete/remove/cancel, use delete_task tool
            - When user says change/update/rename, use update_task tool

            Always confirm actions with a friendly response.
            Handle errors gracefully and help the user rephrase if needed.
            """,
            tools=[
                # Add the MCP tools that have been implemented in T-306 through T-310
                {
                    "type": "function",
                    "function": {
                        "name": "add_task",
                        "description": "Create a new task for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "User ID who owns this task"},
                                "title": {"type": "string", "description": "Task title"},
                                "description": {"type": "string", "description": "Optional task description"}
                            },
                            "required": ["user_id", "title"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "list_tasks",
                        "description": "List tasks for the user with optional status filter",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "User ID"},
                                "status": {"type": "string", "description": "Filter by status: all, pending, completed", "enum": ["all", "pending", "completed"]}
                            },
                            "required": ["user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "complete_task",
                        "description": "Mark a task as complete",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "User ID"},
                                "task_id": {"type": "integer", "description": "Task ID to complete"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "delete_task",
                        "description": "Delete a task",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "User ID"},
                                "task_id": {"type": "integer", "description": "Task ID to delete"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "update_task",
                        "description": "Update a task title or description",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "User ID"},
                                "task_id": {"type": "integer", "description": "Task ID to update"},
                                "title": {"type": "string", "description": "New title (optional)"},
                                "description": {"type": "string", "description": "New description (optional)"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                }
            ]
        )

    # ... other methods like create_thread, chat, etc.
```

## Verification
- [x] All 5 MCP tools registered with the assistant
- [x] Proper parameter schemas defined for each tool
- [x] Instructions guide AI to use appropriate tools
- [x] Import functionality tested: `import agent` works without errors
- [x] Assistant creation works with all tools
- [x] Security considerations addressed (user_id validation in all tools)

## Next Steps
- T-312: Implement Agent Runner (depends on T-311)
- T-316: Integrate Agent with MCP tools (depends on T-312 and T-306-T-310)
- T-313: Create chat API endpoint (depends on T-312)
- Integration testing of the complete agent-tool chain

## Notes
- The implementation follows the architecture specified in the plan.md file
- All tools include proper parameter validation and descriptions
- The agent instructions guide natural language processing to appropriate tool usage
- User ID validation ensures security across all tools
- The implementation is ready for the Agent Runner integration in T-312
- Proper error handling framework is in place for graceful failure recovery

## Status
Completed successfully. The OpenAI Agent is defined with all 5 MCP tools integrated and is ready for the Agent Runner implementation.