---
id: 005
title: OpenRouter API Integration
stage: misc
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-3-ai-chatbot
branch: 323-test-mcp-tools
user: Coders
command: none
labels: ["openrouter", "api-integration", "configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/agent.py
tests:
  - Manual test: agent.py initialization
  - Backend server startup verification
---

## Prompt

User revealed they are using OpenRouter API instead of OpenAI API:

"Why do you need OpenAI key? I'm using OpenRouter API key instead, you can check in backend/.env... and yes, domain allowlist is also updated there"

User's .env configuration:
- OPENROUTER_API_KEY=
- OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
- OPENAI_API_DOMAIN_ALLOWLIST=

## Response snapshot

**Problem Identified:**
The initial implementation attempted to pass a custom AsyncOpenAI client to the Agent constructor:
```python
todobot_agent = Agent(
    name="TodoBot",
    instructions=get_agent_instructions(),
    model=MODEL_NAME,
    tools=[add_task, list_tasks, complete_task, delete_task, update_task],
    client=get_openai_client()  # ERROR: Agent doesn't accept 'client' parameter
)
```

This failed with: `TypeError: Agent.__init__() got an unexpected keyword argument 'client'`

**Solution Implemented:**
Modified agent.py to configure OpenAI SDK environment variables before creating the Agent. The Agents SDK automatically uses OPENAI_API_KEY and OPENAI_BASE_URL environment variables:

```python
def configure_openai_environment():
    """
    Configure OpenAI SDK environment variables.
    Supports both OpenAI and OpenRouter APIs.
    """
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openrouter_base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

    if openrouter_key:
        # Configure for OpenRouter
        os.environ["OPENAI_API_KEY"] = openrouter_key
        os.environ["OPENAI_BASE_URL"] = openrouter_base_url
    else:
        # Use standard OpenAI configuration
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            raise ValueError("Either OPENROUTER_API_KEY or OPENAI_API_KEY must be set")

# Configure environment before creating agent
configure_openai_environment()

# Create agent without custom client parameter
todobot_agent = Agent(
    name="TodoBot",
    instructions=get_agent_instructions(),
    model=MODEL_NAME,
    tools=[add_task, list_tasks, complete_task, delete_task, update_task]
)
```

**Verification:**
```bash
$ python agent.py
[OK] OpenAI Agents SDK imported successfully
[OK] Using OpenRouter API
[OK] Base URL: https://openrouter.ai/api/v1
[OK] Agent 'TodoBot' created with 5 tools
[OK] Agent model: gpt-4o
[OK] Agent instructions: 606 characters

[OK] Function tools registered:
     - add_task
     - list_tasks
     - complete_task
     - delete_task
     - update_task

[OK] Agent Runner implemented

TodoBot agent is ready for chat API integration.
```

Backend server confirmed running on port 8001 with OpenRouter configuration.

## Outcome

- ✅ Impact: Successfully integrated OpenRouter API as alternative to OpenAI API. Agent now supports both OpenAI and OpenRouter based on environment configuration.
- 🧪 Tests: Manual verification - agent initialization successful, backend server running
- 📁 Files: Modified backend/agent.py (removed AsyncOpenAI import, added environment configuration)
- 🔁 Next prompts: Test actual chat functionality with OpenRouter, verify MCP tools work correctly
- 🧠 Reflection: The OpenAI Agents SDK doesn't expose a client parameter but respects standard OpenAI SDK environment variables (OPENAI_API_KEY, OPENAI_BASE_URL). This is the correct approach for custom API endpoints.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to pass custom client failed. Agent class API doesn't support custom client injection.
- Graders run and results (PASS/FAIL): PASS - Agent initializes correctly with OpenRouter configuration
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test end-to-end chat flow with OpenRouter to verify tool calls work correctly
