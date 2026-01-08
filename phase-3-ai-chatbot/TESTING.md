# Phase III: AI Chatbot - Testing Guide

This document provides testing procedures for Phase III AI Chatbot implementation.

## Prerequisites

1. **Environment Setup**
   - Backend running: `cd backend && uvicorn main:app --reload`
   - Frontend running: `cd frontend && npm run dev`
   - Database migrated: `cd backend && python migrate_phase3.py`
   - Environment variables set:
     - `OPENAI_API_KEY` in backend/.env
     - `DATABASE_URL` in backend/.env
     - `BETTER_AUTH_SECRET` in backend/.env

2. **User Account**
   - Create a test user account via signup
   - Note the user_id for testing

## T-323: Test All MCP Tools

Test each MCP tool individually to ensure proper functionality.

### Test add_task

```bash
# Using curl (replace USER_ID and TOKEN)
curl -X POST http://localhost:8000/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'

# Expected: Task created successfully, response confirms creation
```

**Test Cases:**
- ✓ Valid title (1-200 chars)
- ✓ With description
- ✓ Without description
- ✗ Empty title (should fail)
- ✗ Title > 200 chars (should fail)
- ✗ Description > 1000 chars (should fail)

### Test list_tasks

```bash
curl -X POST http://localhost:8000/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all my tasks"}'

# Expected: List of all tasks returned
```

**Test Cases:**
- ✓ List all tasks
- ✓ List pending tasks: "Show me pending tasks"
- ✓ List completed tasks: "What have I completed?"
- ✓ Empty list handling

### Test complete_task

```bash
curl -X POST http://localhost:8000/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Mark task 1 as complete"}'

# Expected: Task marked as complete
```

**Test Cases:**
- ✓ Valid task ID
- ✓ Toggle completion (complete → pending → complete)
- ✗ Invalid task ID (should fail gracefully)
- ✗ Task belonging to another user (should fail)

### Test delete_task

```bash
curl -X POST http://localhost:8000/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Delete task 2"}'

# Expected: Task deleted successfully
```

**Test Cases:**
- ✓ Valid task ID
- ✗ Invalid task ID (should fail gracefully)
- ✗ Task belonging to another user (should fail)
- ✗ Already deleted task (should fail)

### Test update_task

```bash
curl -X POST http://localhost:8000/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Change task 1 to Call mom tonight"}'

# Expected: Task updated successfully
```

**Test Cases:**
- ✓ Update title only
- ✓ Update description only
- ✓ Update both title and description
- ✗ Invalid task ID (should fail)
- ✗ Title validation (1-200 chars)
- ✗ Description validation (0-1000 chars)

## T-324: Test Natural Language Commands

Test the agent's ability to understand various phrasings.

### Add Task Variations

```
"Add a task to buy groceries"
"I need to remember to pay bills"
"Create a task for calling mom"
"Remind me to submit the report"
"Add buy milk to my todo list"
```

**Expected:** All variations should trigger add_task tool

### List Task Variations

```
"Show me all my tasks"
"What's on my todo list?"
"List my tasks"
"What do I need to do?"
"Show pending tasks"
"What have I completed?"
```

**Expected:** All variations should trigger list_tasks tool with appropriate filters

### Complete Task Variations

```
"Mark task 3 as complete"
"I finished task 1"
"Task 2 is done"
"Complete the groceries task"
"Check off task 5"
```

**Expected:** All variations should trigger complete_task tool

### Delete Task Variations

```
"Delete task 4"
"Remove the meeting task"
"Cancel task 2"
"Get rid of task 1"
```

**Expected:** All variations should trigger delete_task tool

### Update Task Variations

```
"Change task 1 to 'Call mom tonight'"
"Update task 2 description to 'Buy organic milk'"
"Rename task 3 to 'Submit report by Friday'"
"Modify task 1"
```

**Expected:** All variations should trigger update_task tool

### Complex Scenarios

```
"Add three tasks: buy milk, call mom, and submit report"
"Show me pending tasks and then mark task 1 as complete"
"What's my first task? Mark it as done."
```

**Expected:** Agent should handle multi-step requests appropriately

## T-325: Test Conversation Persistence

Test that conversations are properly saved and restored.

### Test 1: New Conversation

1. Open chat interface
2. Send message: "Add a task to test persistence"
3. Note the conversation_id in the response
4. Send another message: "Show me my tasks"
5. Verify both messages appear in the UI

**Expected:**
- Conversation ID assigned after first message
- All messages stored in database
- Messages displayed in correct order

### Test 2: Conversation Continuity

1. Continue from Test 1
2. Send message: "Mark the test task as complete"
3. Agent should understand context (which task to complete)

**Expected:**
- Agent has access to full conversation history
- Can reference previous messages
- Maintains context across multiple turns

### Test 3: Server Restart

1. Note current conversation_id
2. Stop backend server
3. Restart backend server
4. Refresh frontend
5. Send new message in same conversation

**Expected:**
- Conversation history loaded from database
- No data loss
- Conversation continues seamlessly

### Test 4: Multiple Conversations

1. Start a new conversation (refresh page or clear conversation_id)
2. Send message: "Add a task for the new conversation"
3. Verify new conversation_id is different
4. Both conversations should be independent

**Expected:**
- Each conversation has unique ID
- Messages isolated per conversation
- No cross-contamination

### Test 5: Concurrent Users

1. Create two user accounts
2. Both users start conversations simultaneously
3. Each user adds tasks
4. Verify tasks are isolated per user

**Expected:**
- User A cannot see User B's tasks
- User A cannot modify User B's tasks
- JWT authentication enforces isolation

## Database Verification

After testing, verify database state:

```sql
-- Check conversations
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;

-- Check messages
SELECT * FROM messages ORDER BY created_at DESC LIMIT 20;

-- Verify message count per conversation
SELECT conversation_id, COUNT(*) as message_count
FROM messages
GROUP BY conversation_id;

-- Check tool_calls storage
SELECT id, role, tool_calls
FROM messages
WHERE tool_calls IS NOT NULL
LIMIT 10;
```

## Success Criteria

### T-323: All MCP Tools Tested
- [ ] add_task: All test cases pass
- [ ] list_tasks: All test cases pass
- [ ] complete_task: All test cases pass
- [ ] delete_task: All test cases pass
- [ ] update_task: All test cases pass
- [ ] Error handling works correctly
- [ ] Validation prevents invalid inputs

### T-324: Natural Language Commands Tested
- [ ] Multiple phrasings understood for each operation
- [ ] Agent selects correct tools
- [ ] Complex multi-step requests handled
- [ ] Ambiguous requests clarified
- [ ] Error messages are helpful

### T-325: Conversation Persistence Tested
- [ ] New conversations created correctly
- [ ] Messages stored in database
- [ ] Conversation history loaded correctly
- [ ] Server restart doesn't lose data
- [ ] Multiple conversations work independently
- [ ] User isolation enforced

## Troubleshooting

### Common Issues

**Issue:** "OPENAI_API_KEY not set"
- Solution: Add `OPENAI_API_KEY=sk-...` to backend/.env

**Issue:** "Table 'conversations' doesn't exist"
- Solution: Run `python migrate_phase3.py`

**Issue:** "403 Forbidden"
- Solution: Check JWT token is valid and user_id matches

**Issue:** Agent doesn't call tools
- Solution: Check agent instructions and tool definitions

**Issue:** Tool calls fail
- Solution: Check database connection and task_service functions

## Reporting Results

Document test results in this format:

```
Test: T-323 - add_task
Status: PASS/FAIL
Notes: [Any observations or issues]

Test: T-324 - Natural language variations
Status: PASS/FAIL
Notes: [Which phrasings worked/didn't work]

Test: T-325 - Conversation persistence
Status: PASS/FAIL
Notes: [Any data loss or issues]
```
