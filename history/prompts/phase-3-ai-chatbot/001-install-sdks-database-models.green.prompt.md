---
id: 001
title: Install SDKs and Database Models
stage: green
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-3-ai-chatbot
branch: 323-test-mcp-tools
user: Coders
command: /sp.implement
labels: ["setup", "dependencies", "database-models", "mcp", "openai-agents"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/agent.py
  - backend/mcp_server.py
  - backend/models.py
  - backend/pyproject.toml
  - phase-3-ai-chatbot/tasks.md
tests:
  - backend/agent.py (import test)
  - backend/mcp_server.py (import test)
  - backend/models.py (import test)
---

## Prompt

T-301 | Install OpenAI Agents SDK | None

User also requested to:
- Check .claude folder structure (agents, commands, skills)
- Create history/prompts/phase-3-ai-chatbot folder
- Make PHR of completed tasks

## Response snapshot

Successfully completed tasks T-301 through T-305:

**T-301: Install OpenAI Agents SDK**
- Installed openai-agents package using `uv add openai-agents`
- Created `backend/agent.py` with OpenAI client initialization
- Defined agent instructions for TodoBot
- Verified imports work correctly

**T-302: Install Official MCP SDK**
- Verified MCP SDK (v1.25.0) was installed as dependency
- Created `backend/mcp_server.py` with MCP server foundation
- Defined 5 MCP tool schemas: add_task, list_tasks, complete_task, delete_task, update_task
- Implemented `get_mcp_tools()` function to return tool definitions

**T-303 & T-304: Create Database Models**
- Added `Conversation` model to `backend/models.py`
  - Fields: id, user_id, created_at, updated_at
  - Foreign key to users table
- Added `Message` model to `backend/models.py`
  - Fields: id, user_id, conversation_id, role, content, tool_calls, created_at
  - Foreign keys to users and conversations tables
  - tool_calls stored as JSON string

**T-305: MCP Server Foundation**
- Initialized MCP server named "todo-server"
- Defined complete tool schemas with input validation
- Prepared structure for tool implementation (T-306 to T-310)

All imports tested successfully. Database models ready for migration.

## Outcome

- ✅ Impact: Foundation established for Phase III AI Chatbot - OpenAI Agents SDK and MCP SDK integrated, database models created
- 🧪 Tests: Import tests passed for agent.py, mcp_server.py, and models.py
- 📁 Files: 5 files created/modified (agent.py, mcp_server.py, models.py, pyproject.toml, tasks.md)
- 🔁 Next prompts: Implement MCP tools (T-306 to T-310), create agent runner, implement chat API endpoint
- 🧠 Reflection: Smooth setup phase. MCP SDK was already installed as dependency of openai-agents. Database models follow existing pattern from Phase II.

## Evaluation notes (flywheel)

- Failure modes observed: Initial Unicode encoding error in Windows console (fixed by using ASCII characters), API key validation needed for lazy initialization
- Graders run and results (PASS/FAIL): Manual import tests - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement first MCP tool (add_task) and test with actual database operations
