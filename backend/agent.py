"""
Standard OpenAI SDK with Function Calling + OpenRouter Support
Phase III: AI Chatbot - Agent with ChatKit

This module implements TodoBot using standard OpenAI SDK.
Supports both OpenAI and OpenRouter APIs.
"""

from openai import OpenAI
from typing import List, Dict, Any, Optional
import os
import json

# Import MCP tool implementations
from mcp_server import (
    add_task as mcp_add_task,
    list_tasks as mcp_list_tasks,
    complete_task as mcp_complete_task,
    delete_task as mcp_delete_task,
    update_task as mcp_update_task
)


class TodoAgent:
    """
    AI agent for task management using OpenAI Chat Completions API.

    Features:
    - Natural language understanding
    - Function calling for CRUD operations
    - Stateless design
    - Conversation history support
    - OpenRouter support
    """

    def __init__(self, api_key: str, base_url: Optional[str] = None, model: str = "gpt-4o"):
        """
        Initialize TodoAgent with API configuration.

        Args:
            api_key: OpenAI or OpenRouter API key
            base_url: Optional base URL (for OpenRouter)
            model: Model name
        """
        if base_url:
            self.client = OpenAI(api_key=api_key, base_url=base_url)
        else:
            self.client = OpenAI(api_key=api_key)

        self.model = model
        self.tools = self._define_tools()
        self.tool_functions = self._map_tool_functions()

    def _define_tools(self) -> List[Dict[str, Any]]:
        """Define function tools in OpenAI format."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Create a new todo task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID who owns this task"
                            },
                            "title": {
                                "type": "string",
                                "description": "Task title"
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional task description"
                            }
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID"
                            },
                            "status": {
                                "type": "string",
                                "enum": ["all", "pending", "completed"],
                                "description": "Filter by status"
                            }
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
                            "user_id": {
                                "type": "string",
                                "description": "User ID"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID to complete"
                            }
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
                            "user_id": {
                                "type": "string",
                                "description": "User ID"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID to delete"
                            }
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
                            "user_id": {
                                "type": "string",
                                "description": "User ID"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID"
                            },
                            "title": {
                                "type": "string",
                                "description": "New title"
                            },
                            "description": {
                                "type": "string",
                                "description": "New description"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    def _map_tool_functions(self) -> Dict[str, Any]:
        """Map tool names to implementation functions."""
        return {
            "add_task": mcp_add_task,
            "list_tasks": mcp_list_tasks,
            "complete_task": mcp_complete_task,
            "delete_task": mcp_delete_task,
            "update_task": mcp_update_task
        }

    async def execute_tool(self, function_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a tool function."""
        if function_name not in self.tool_functions:
            return {"error": f"Unknown function: {function_name}"}

        try:
            func = self.tool_functions[function_name]
            result = await func(**arguments)
            return result
        except Exception as e:
            return {"error": str(e)}

    async def chat(
        self,
        user_id: str,
        message: str,
        conversation_history: List[Dict[str, str]] = []
    ) -> Dict[str, Any]:
        """
        Process chat message and return response.

        Args:
            user_id: User identifier (auto-injected into tool calls)
            message: User's message
            conversation_history: Previous messages

        Returns:
            Dictionary with response, tool_calls, tool_results
        """
        # Build system message
        system_message = {
            "role": "system",
            "content": """You are TaskFlowBot, a helpful task management assistant.

IMPORTANT: You do NOT need to ask for user_id - it's automatically provided.

Natural language commands:
- "Add task to buy groceries" → use add_task
- "Show me all my tasks" → use list_tasks
- "What's pending?" → use list_tasks with status="pending"
- "Mark task 3 as complete" → use complete_task
- "Delete task 2" → use delete_task
- "Change task 1 to Call mom" → use update_task

CRITICAL - Always include task IDs in responses:
- When adding: "I've added Task #[ID]: [title]"
- When listing: "Task #[ID]: [title]"
- When completing/deleting/updating: "Task #[ID] has been [action]"

Always confirm actions with friendly responses."""
        }

        # Build messages
        messages = [system_message]
        messages.extend(conversation_history)
        messages.append({"role": "user", "content": message})

        # Call OpenAI/OpenRouter
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=self.tools,
            tool_choice="auto"
        )

        assistant_message = response.choices[0].message
        tool_calls = assistant_message.tool_calls
        tool_results = []
        tool_names = []

        if tool_calls:
            # Execute each tool call
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Add user_id to arguments
                function_args["user_id"] = user_id

                # Execute tool
                result = await self.execute_tool(function_name, function_args)

                tool_names.append(function_name)
                tool_results.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "content": json.dumps(result)
                })

                # Add to messages for final response
                messages.append({
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [{
                        "id": tool_call.id,
                        "type": "function",
                        "function": {
                            "name": tool_call.function.name,
                            "arguments": tool_call.function.arguments
                        }
                    }]
                })

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "content": json.dumps(result)
                })

            # Get final response
            final_response = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )

            return {
                "response": final_response.choices[0].message.content,
                "tool_calls": tool_names,
                "tool_results": tool_results
            }

        # No tool calls
        return {
            "response": assistant_message.content,
            "tool_calls": [],
            "tool_results": []
        }


# Initialize agent
def get_agent() -> TodoAgent:
    """Get or create TodoAgent instance with OpenRouter support."""
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if openrouter_key:
        # Use OpenRouter
        base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        model = os.getenv("AI_MODEL", "openai/gpt-4o-mini")

        print(f"[INFO] Using OpenRouter API")
        print(f"[INFO] Model: {model}")

        return TodoAgent(api_key=openrouter_key, base_url=base_url, model=model)

    elif openai_key:
        # Use OpenAI
        model = os.getenv("AI_MODEL", "gpt-4o")

        print(f"[INFO] Using OpenAI API")
        print(f"[INFO] Model: {model}")

        return TodoAgent(api_key=openai_key, model=model)

    else:
        raise ValueError("Either OPENROUTER_API_KEY or OPENAI_API_KEY must be set")


# Wrapper function for compatibility with existing chat.py
async def run_agent(user_message: str, user_id: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Run agent - compatible with existing chat.py.

    Args:
        user_message: User's message
        user_id: User identifier
        conversation_history: Previous messages

    Returns:
        Dictionary with response, tool_calls, error
    """
    try:
        agent = get_agent()
        result = await agent.chat(
            user_id=user_id,
            message=user_message,
            conversation_history=conversation_history or []
        )

        return {
            "response": result["response"],
            "tool_calls": result["tool_calls"],
            "error": None
        }

    except Exception as e:
        return {
            "response": f"I encountered an error: {str(e)}",
            "tool_calls": [],
            "error": str(e)
        }


# Test
if __name__ == "__main__":
    print("[OK] Standard OpenAI SDK imported successfully")

    try:
        agent = get_agent()
        print(f"[OK] TodoAgent created with {len(agent.tools)} tools")
        print(f"[OK] Model: {agent.model}")
        print("[OK] Function tools registered:")
        for tool in agent.tools:
            print(f"     - {tool['function']['name']}")
        print("\n[OK] TodoAgent ready for chat API integration")
    except ValueError as e:
        print(f"[WARNING] {e}")
        print("[INFO] Set OPENROUTER_API_KEY or OPENAI_API_KEY")
