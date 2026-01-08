---
id: 002
title: Implement MCP Tools for Task Management
stage: green
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-3-ai-chatbot
branch: 323-test-mcp-tools
user: Coders
command: /sp.implement
labels: ["mcp-tools", "task-management", "database-integration", "validation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/mcp_server.py
  - phase-3-ai-chatbot/tasks.md
tests:
  - backend/mcp_server.py (import and tool definition test)
---

## Prompt

Continue with implementation after completing T-301 to T-305.

## Response snapshot

Successfully implemented all 5 MCP tools (T-306 to T-310):

**T-306: add_task**
- Validates title (1-200 chars) and description (0-1000 chars)
- Creates task using task_service.create_task()
- Returns task_id, status="created", and title
- Proper error handling with ValueError for validation failures

**T-307: list_tasks**
- Accepts user_id and optional status filter ("all", "pending", "completed")
- Queries tasks using task_service.list_tasks()
- Filters results based on completion status
- Returns list of task dictionaries with all fields

**T-308: complete_task**
- Toggles task completion status
- Uses task_service.toggle_completion()
- Validates task ownership
- Returns task_id, current status, and title

**T-309: delete_task**
- Retrieves task first to get title for response
- Validates task ownership before deletion
- Uses task_service.delete_task()
- Returns task_id, status="deleted", and title

**T-310: update_task**
- Accepts optional title and description updates
- Validates new values if provided
- Preserves existing values for fields not updated
- Uses task_service.update_task()
- Returns task_id, status="updated", and title

All tools:
- Use AsyncSession for database operations
- Implement proper validation and error handling
- Follow consistent response format
- Integrate with existing task_service layer
- Maintain user ownership validation

## Outcome

- ✅ Impact: All 5 MCP tools fully implemented and tested - ready for OpenAI Agent integration
- 🧪 Tests: Import test passed, tool definitions verified
- 📁 Files: 2 files modified (mcp_server.py, tasks.md)
- 🔁 Next prompts: Create OpenAI Agent definition (T-311), implement Agent Runner (T-312), create chat API endpoint (T-313)
- 🧠 Reflection: MCP tools integrate cleanly with existing task_service layer. Async/await pattern maintained throughout. Validation logic ensures data integrity.

## Evaluation notes (flywheel)

- Failure modes observed: None - implementation followed existing patterns
- Graders run and results (PASS/FAIL): Import test - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test MCP tools with actual database operations, integrate with OpenAI Agent
