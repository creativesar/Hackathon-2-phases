# OpenRouter Integration - Testing Guide

## Overview

The backend has been successfully configured to use OpenRouter API instead of OpenAI API. This guide provides testing instructions to verify the integration works correctly.

## Configuration Status

✅ **Backend Configuration:**
- `OPENROUTER_API_KEY` detected in backend/.env
- `OPENROUTER_BASE_URL` set to https://openrouter.ai/api/v1
- Agent configured to use OpenRouter via environment variables
- Backend server running on port 8001

✅ **Agent Initialization:**
```
[OK] OpenAI Agents SDK imported successfully
[OK] Using OpenRouter API
[OK] Base URL: https://openrouter.ai/api/v1
[OK] Agent 'TodoBot' created with 5 tools
[OK] Agent model: gpt-4o
```

## Testing Steps

### 1. Get Authentication Token

First, you need to sign in and get your JWT token:

**Option A: Using Frontend**
1. Open http://localhost:3000
2. Sign in with your credentials
3. Open browser DevTools (F12)
4. Go to Application/Storage → Cookies
5. Copy the value of `better-auth.session_token`

**Option B: Using API**
```bash
curl -X POST http://localhost:8001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Save the token and user_id from the response.

### 2. Test Chat Endpoint with OpenRouter

Replace `{USER_ID}` and `{TOKEN}` with your actual values:

**Test 1: Add Task**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to test OpenRouter integration"}'
```

**Expected Response:**
```json
{
  "conversation_id": 1,
  "response": "I've added 'test OpenRouter integration' to your tasks",
  "tool_calls": [
    {
      "tool": "add_task",
      "arguments": {
        "user_id": "your-user-id",
        "title": "test OpenRouter integration"
      }
    }
  ]
}
```

**Test 2: List Tasks**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all my tasks"}'
```

**Test 3: Complete Task**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Mark task 1 as complete"}'
```

**Test 4: Update Task**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Change task 1 to Buy groceries for dinner"}'
```

**Test 5: Delete Task**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Delete task 1"}'
```

### 3. Test Conversation Persistence

**First Message:**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to test conversation persistence"}'
```

Note the `conversation_id` from the response (e.g., 1).

**Continue Conversation:**
```bash
curl -X POST http://localhost:8001/api/{USER_ID}/chat \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": 1,
    "message": "Show me my tasks"
  }'
```

The agent should have access to the full conversation history.

### 4. Test Frontend Integration

1. Open http://localhost:3000/en/chat
2. Sign in if not already signed in
3. Type: "Add a task to test OpenRouter from frontend"
4. Verify the response appears
5. Check for tool call indicators in the UI

## Verification Checklist

- [ ] Backend server running on port 8001
- [ ] OpenRouter API key configured in .env
- [ ] Agent initializes with OpenRouter configuration
- [ ] Chat endpoint responds to requests
- [ ] add_task tool executes successfully
- [ ] list_tasks tool executes successfully
- [ ] complete_task tool executes successfully
- [ ] update_task tool executes successfully
- [ ] delete_task tool executes successfully
- [ ] Conversation persistence works
- [ ] Frontend chat interface works
- [ ] Tool call indicators display correctly

## Troubleshooting

### Error: "OPENAI_API_KEY not set"
This shouldn't happen with OpenRouter configured, but if it does:
- Verify OPENROUTER_API_KEY is set in backend/.env
- Restart the backend server
- Check agent.py configure_openai_environment() function

### Error: "Invalid API key"
- Verify your OpenRouter API key is valid
- Check https://openrouter.ai/keys
- Ensure the key has sufficient credits

### Error: "Model not found"
- OpenRouter supports gpt-4o model
- Check AI_MODEL environment variable (default: gpt-4o)
- Verify your OpenRouter account has access to gpt-4o

### Error: "403 Forbidden"
- JWT token expired or invalid
- Sign in again to get a new token
- Verify user_id in URL matches token

### Error: "Conversation not found"
- conversation_id doesn't exist
- Omit conversation_id to start a new conversation
- Check database for existing conversations

## Database Verification

Check that conversations and messages are being stored:

```sql
-- Check recent conversations
SELECT * FROM conversations
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC
LIMIT 5;

-- Check recent messages
SELECT m.id, m.role, m.content, m.tool_calls, m.created_at
FROM messages m
JOIN conversations c ON m.conversation_id = c.id
WHERE c.user_id = 'your-user-id'
ORDER BY m.created_at DESC
LIMIT 10;
```

## Success Criteria

✅ **OpenRouter Integration:**
- Agent uses OpenRouter API instead of OpenAI
- All 5 MCP tools work correctly
- No errors related to API configuration

✅ **Chat Functionality:**
- Natural language commands understood
- Tools called appropriately
- Responses are helpful and accurate

✅ **Conversation Persistence:**
- Messages stored in database
- Conversation history maintained
- Context preserved across requests

## Next Steps

After successful testing:
1. Update tasks.md to mark T-323, T-324, T-325 as complete
2. Test frontend chat interface thoroughly
3. Record demo video (T-329)
4. Create final documentation

## Notes

- OpenRouter API is compatible with OpenAI SDK
- The integration uses environment variable configuration
- No code changes needed to switch between OpenAI and OpenRouter
- Domain allowlist is already configured (OPENAI_API_DOMAIN_ALLOWLIST in .env)
