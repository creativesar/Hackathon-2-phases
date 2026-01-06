# Phase III: AI Chatbot - Tasks

## Task Breakdown

| ID | Description | Dependencies | Status |
|-----|-------------|----------------|---------|
| T-301 | Install OpenAI Agents SDK | None | Completed |
| T-302 | Install Official MCP SDK | None | Completed |
| T-303 | Create Conversation database models | None | Completed |
| T-304 | Create Message database model | T-303 | Completed |
| T-305 | Implement MCP server foundation | T-302 | Completed |
| T-306 | Implement MCP tool: add_task | T-305 | Completed |
| T-307 | Implement MCP tool: list_tasks | T-305 | Completed |
| T-308 | Implement MCP tool: complete_task | T-305 | Completed |
| T-309 | Implement MCP tool: delete_task | T-305 | Completed |
| T-310 | Implement MCP tool: update_task | T-305 | Completed |
| T-311 | Create OpenAI Agent definition | T-301, T-306-T-310 | Completed |
| T-312 | Implement Agent Runner | T-311 | Completed |
| T-313 | Create chat API endpoint | T-312, T-303, T-304 | Completed |
| T-314 | Implement conversation loading | T-313 | Completed |
| T-315 | Implement message storage | T-313 | Completed |
| T-316 | Integrate Agent with MCP tools | T-312, T-306-T-310 | Completed |
| T-317 | Implement stateless design | T-313 | Completed |
| T-318 | Add JWT middleware to chat endpoint | T-313 | Completed |
| T-319 | Create ChatKit frontend component | T-317 | Completed |
| T-320 | Implement chat message display | T-319 | Completed |
| T-321 | Implement chat input handling | T-319 | Completed |
| T-322 | Add tool call indicators to UI | T-319 | Completed |
| T-323 | Test all MCP tools | T-306-T-310 | Pending |
| T-324 | Test natural language commands | T-312 | Pending |
| T-325 | Test conversation persistence | T-317 | Pending |
| T-326 | Configure OpenAI domain allowlist | None | Pending |
| T-327 | Test end-to-end workflow | T-325 | Pending |
| T-328 | Create comprehensive README | T-327 | Pending |
| T-329 | Record demo video | T-328 | Pending |

---

## Detailed Tasks

### T-301: Install OpenAI Agents SDK

**Priority**: High
**Related Spec**: Technology Stack

**Steps**:
1. Navigate to `backend/`
2. Install SDK: `uv add openai-agents`
3. Create `backend/agent.py` with basic import
4. Test import works correctly
5. Document API usage

**Outputs**: OpenAI Agents SDK installed

---

### T-302: Install Official MCP SDK

**Priority**: High
**Related Spec**: Technology Stack

**Steps**:
1. Navigate to `backend/`
2. Install SDK: `uv install mcp`
3. Create `backend/mcp_server.py` with basic import
4. Test MCP server can be created
5. Document MCP tool decorator usage

**Outputs**: Official MCP SDK installed

---

### T-303: Create Conversation database models

**Priority**: High
**Related Spec**: Database Models - Conversation

**Steps**:
1. Navigate to `backend/models.py`
2. Add `Conversation` class using SQLModel:
   ```python
   class Conversation(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       user_id: str
       created_at: datetime = Field(default_factory=datetime.utcnow)
       updated_at: datetime = Field(default_factory=datetime.utcnow)
   ```
3. Add foreign key to Message model
4. Update database creation script

**Outputs**: Conversation model created

---

### T-304: Create Message database model

**Priority**: High
**Related Spec**: Database Models - Message

**Steps**:
1. Navigate to `backend/models.py`
2. Add `Message` class using SQLModel:
   ```python
   class Message(SQLModel, table=True):
       id: Optional[int] = Field(default=None, primary_key=True)
       user_id: str
       conversation_id: int = Field(foreign_key="conversation.id")
       role: str  # "user" or "assistant"
       content: str
       tool_calls: Optional[str] = Field(default=None)  # JSON string
       created_at: datetime = Field(default_factory=datetime.utcnow)
   ```
3. Add index on conversation_id

**Outputs**: Message model created

---

### T-305: Implement MCP server foundation

**Priority**: High
**Related Spec**: MCP Tools

**Steps**:
1. Create `backend/mcp_server.py`
2. Import MCP SDK decorators
3. Create basic MCP server structure:
   ```python
   from mcp.server import Server

   mcp_server = Server("todo-server")
   ```
4. Connect to database session
5. Add error handling wrapper
6. Create tool registration function

**Outputs**: MCP server foundation ready

---

### T-306: Implement MCP tool: add_task

**Priority**: High
**Related Spec**: MCP Tools - add_task

**Steps**:
1. Add `@mcp_tool` decorator to `add_task` function
2. Define parameters: `user_id`, `title`, `description`
3. Implement validation:
   - Title required, 1-200 chars
   - Description optional, 0-1000 chars
4. Call database create task function
5. Return formatted response:
   ```python
   return {
       "task_id": task.id,
       "status": "created",
       "title": task.title
   }
   ```
6. Add error handling

**Outputs**: add_task MCP tool functional

---

### T-307: Implement MCP tool: list_tasks

**Priority**: High
**Related Spec**: MCP Tools - list_tasks

**Steps**:
1. Add `@mcp_tool` decorator to `list_tasks` function
2. Define parameters: `user_id`, `status`
3. Validate status (optional: "all"|"pending"|"completed")
4. Call database query function
5. Filter by user_id and status if provided
6. Return task array
7. Handle empty result case

**Outputs**: list_tasks MCP tool functional

---

### T-308: Implement MCP tool: complete_task

**Priority**: High
**Related Spec**: MCP Tools - complete_task

**Steps**:
1. Add `@mcp_tool` decorator to `complete_task` function
2. Define parameters: `user_id`, `task_id`
3. Validate task exists and belongs to user
4. Toggle `completed` boolean
5. Update timestamp
6. Return formatted response:
   ```python
   return {
       "task_id": task.id,
       "status": "completed" if task.completed else "pending",
       "title": task.title
   }
   ```
7. Add error handling for not found

**Outputs**: complete_task MCP tool functional

---

### T-309: Implement MCP tool: delete_task

**Priority**: High
**Related Spec**: MCP Tools - delete_task

**Steps**:
1. Add `@mcp_tool` decorator to `delete_task` function
2. Define parameters: `user_id`, `task_id`
3. Validate task exists and belongs to user
4. Delete from database
5. Return formatted response:
   ```python
   return {
       "task_id": task.id,
       "status": "deleted",
       "title": task.title
   }
   ```
6. Add error handling

**Outputs**: delete_task MCP tool functional

---

### T-310: Implement MCP tool: update_task

**Priority**: High
**Related Spec**: MCP Tools - update_task

**Steps**:
1. Add `@mcp_tool` decorator to `update_task` function
2. Define parameters: `user_id`, `task_id`, `title`, `description`
3. Validate task exists and belongs to user
4. Update fields if provided (optional)
5. Validate title (1-200 chars) and description (0-1000 chars)
6. Update timestamp
7. Return formatted response:
   ```python
   return {
       "task_id": task.id,
       "status": "updated",
       "title": task.title
   }
   ```
8. Add error handling

**Outputs**: update_task MCP tool functional

---

### T-311: Create OpenAI Agent definition

**Priority**: High
**Related Spec**: Agent Behavior

**Steps**:
1. Create `backend/agent.py`
2. Define Agent with instructions:
   ```python
   from openai import Agent

   agent = Agent(
       name="TodoBot",
       instructions="""
       You are a helpful todo assistant. You help users manage their tasks through natural language.
       Use the available tools to perform actions:
       - When user wants to add/remember something, use add_task tool
       - When user asks to see/show/list tasks, use list_tasks tool
       - When user says done/complete/finished, use complete_task tool
       - When user says delete/remove/cancel, use delete_task tool
       - When user says change/update/rename, use update_task tool

       Always confirm actions with a friendly response.
       Handle errors gracefully and help user rephrase if needed.
       """,
       tools=get_mcp_tools()  # Get all MCP tools
   )
   ```
3. Add tool descriptions for each MCP tool
4. Configure agent behavior settings

**Outputs**: OpenAI Agent defined

---

### T-312: Implement Agent Runner

**Priority**: High
**Related Spec**: OpenAI Agents Integration

**Steps**:
1. Import Runner from OpenAI SDK
2. Create `run_agent` function:
   ```python
   async def run_agent(messages: List[dict]) -> AgentResponse:
       runner = Runner(agent)
       response = await runner.run(messages)
       return response
   ```
3. Handle tool selection
4. Handle tool execution
5. Format response for API
6. Add retry logic for tool failures

**Outputs**: Agent Runner functional

---

### T-313: Create chat API endpoint

**Priority**: High
**Related Spec**: Chat API Endpoint

**Steps**:
1. Create `backend/routes/chat.py`
2. Define Pydantic schema for request:
   ```python
   class ChatRequest(BaseModel):
       conversation_id: Optional[int] = None
       message: str
   ```
3. Define response schema:
   ```python
   class ChatResponse(BaseModel):
       conversation_id: int
       response: str
       tool_calls: Optional[List[dict]] = None
   ```
4. Implement `POST /api/{user_id}/chat` endpoint
5. Add JWT authentication middleware
6. Add user_id validation (match token to URL path)

**Outputs**: Chat API endpoint skeleton created

---

### T-314: Implement conversation loading

**Priority**: High
**Related Spec**: Stateless Request Cycle

**Steps**:
1. Add `get_conversation` function to database
2. If conversation_id provided:
   - Fetch conversation from database
   - Validate conversation belongs to user
   - Return conversation
3. If conversation_id not provided:
   - Create new conversation in database
   - Return new conversation
4. Handle error cases (not found, wrong user)

**Outputs**: Conversation loading functional

---

### T-315: Implement message storage

**Priority**: High
**Related Spec**: Stateless Request Cycle

**Steps**:
1. Add `create_message` function to database
2. Store user message with role="user"
3. Store assistant message with role="assistant"
4. Include tool_calls in assistant messages
5. Link messages to conversation_id
6. Return message object with ID

**Outputs**: Message storage functional

---

### T-316: Integrate Agent with MCP tools

**Priority**: High
**Related Spec**: Agent Behavior

**Steps**:
1. Create `get_mcp_tools()` function
2. Return list of all MCP tools in Agent format
3. Map MCP tool names to Agent tool calls
4. Handle tool execution through MCP server
5. Capture tool results
6. Pass results back to Agent

**Outputs**: Agent integrated with MCP tools

---

### T-317: Implement stateless design

**Priority**: High
**Related Spec**: Stateless Architecture

**Steps**:
1. Verify no conversation state in memory
2. All state loaded from database at request start
3. All state saved to database before response
4. Server ready for next request (no memory held)
5. Test with multiple concurrent conversations

**Outputs**: Stateless design verified

---

### T-318: Add JWT middleware to chat endpoint

**Priority**: High
**Related Spec**: JWT Authentication

**Steps**:
1. Import JWT middleware from Phase II
2. Apply to chat endpoint
3. Extract user_id from JWT token
4. Validate user_id matches URL path parameter
5. Raise 403 error if mismatch
6. Pass user_id to endpoint handler

**Outputs**: JWT authentication on chat endpoint

---

### T-319: Create ChatKit frontend component

**Priority**: High
**Related Spec**: Conversational Interface

**Steps**:
1. Install OpenAI ChatKit: `npm install @openai/chatkit`
2. Create `frontend/src/components/ChatInterface.tsx`
3. Import ChatKit components
4. Configure ChatKit with domain key
5. Add JWT token management
6. Set up message state

**Outputs**: ChatKit component created

---

### T-320: Implement chat message display

**Priority**: High
**Related Spec**: Conversational Interface

**Steps**:
1. Create `MessageBubble` component for individual messages
2. Style user messages (right-aligned, blue)
3. Style assistant messages (left-aligned, gray)
4. Display role indicator
5. Format message content (markdown support)
6. Add timestamps

**Outputs**: Message display functional

---

### T-321: Implement chat input handling

**Priority**: High
**Related Spec**: Conversational Interface

**Steps**:
1. Create input field with send button
2. Handle user message submission
3. Call chat API endpoint
4. Include conversation_id in request (after first message)
5. Handle API response
6. Update messages state

**Outputs**: Input handling functional

---

### T-322: Add tool call indicators to UI

**Priority**: Medium
**Related Spec**: Conversational Interface

**Steps**:
1. Parse tool_calls from API response
2. Display tool invocation information:
   - Tool name
   - Parameters used
   - Result
3. Style tool calls distinctly (e.g., code block)
4. Show tool calls inline or below message
5. Handle multiple tool calls

**Outputs**: Tool call indicators displayed

---

### T-323: Test all MCP tools

**Priority**: High
**Related Spec**: MCP Tools

**Steps**:
1. Test add_task:
   - Valid title
   - Invalid title (empty, too long)
   - With and without description
2. Test list_tasks:
   - All tasks
   - Pending tasks
   - Completed tasks
3. Test complete_task:
   - Valid task ID
   - Invalid task ID
   - Toggle multiple times
4. Test delete_task:
   - Valid task ID
   - Invalid task ID
5. Test update_task:
   - Title update
   - Description update
   - Both updates
6. Verify all return proper JSON

**Outputs**: All MCP tools tested

---

### T-324: Test natural language commands

**Priority**: High
**Related Spec**: Agent Behavior

**Steps**:
1. Test "Add a task to buy groceries" → Calls add_task
2. Test "Show me all my tasks" → Calls list_tasks
3. Test "What's pending?" → Calls list_tasks with status="pending"
4. Test "Mark task 3 as complete" → Calls complete_task
5. Test "Delete the meeting task" → Calls list_tasks then delete_task
6. Test "Change task 1 to 'Call mom tonight'" → Calls update_task
7. Test "I need to remember to pay bills" → Calls add_task
8. Test "What have I completed?" → Calls list_tasks with status="completed"
9. Test various phrasings of same intent
10. Verify agent selects correct tools

**Outputs**: Natural language commands working

---

### T-325: Test conversation persistence

**Priority**: High
**Related Spec**: Stateless Request Cycle

**Steps**:
1. Start conversation with first message
2. Note conversation_id from response
3. Send second message with conversation_id
4. Verify conversation loaded from database
5. Verify both messages in database
6. Start new conversation (no conversation_id)
7. Verify new conversation_id created
8. Kill backend and restart
9. Resume conversation with conversation_id
10. Verify history restored

**Outputs**: Conversation persistence verified

---

### T-326: Configure OpenAI domain allowlist

**Priority**: High
**Related Spec**: OpenAI ChatKit Setup

**Steps**:
1. Deploy frontend to production first (or get production URL)
2. Navigate to: https://platform.openai.com/settings/organization/security/domain-allowlist
3. Click "Add domain"
4. Enter frontend URL (without trailing slash)
5. Save changes
6. Get domain key from OpenAI
7. Add to environment variables: `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`
8. Restart frontend to apply

**Outputs**: Domain allowlist configured

---

### T-327: Test end-to-end workflow

**Priority**: High
**Related Spec**: All ACs

**Steps**:
1. Test complete user journey:
   - Register/login user
   - Add task via chat
   - List tasks via chat
   - Complete task via chat
   - Update task via chat
   - Delete task via chat
   - Resume conversation
2. Test error handling:
   - Invalid commands
   - Task not found
   - Network errors
3. Test with multiple users (isolation)
4. Test with multiple concurrent conversations
5. Verify JWT authentication

**Outputs**: End-to-end workflow tested

---

### T-328: Create comprehensive README

**Priority**: Medium
**Related Spec**: Success Criteria

**Steps**:
1. Create `phase-3-ai-chatbot/README.md`
2. Include sections:
   - Project overview
   - Features implemented
   - Prerequisites (OpenAI API key)
   - Installation steps
   - How to use chatbot
   - Natural language examples
   - Architecture diagram
   - Troubleshooting guide
3. Add environment variable documentation
4. Add OpenAI domain allowlist setup guide
5. Add MCP server documentation

**Outputs**: Complete README

---

### T-329: Record demo video

**Priority**: High
**Related Spec**: Demo Requirements

**Steps**:
1. Plan video script (under 90 seconds):
   - Show chatbot interface (10s)
   - Add task via natural language (15s)
   - List tasks via chat (10s)
   - Complete task via chat (10s)
   - Update task via chat (10s)
   - Delete task via chat (10s)
   - Show tool calls (15s)
   - Conversation persistence (10s)
   - Resume conversation (10s)
2. Record demo (use OBS, Loom, or similar)
3. Keep under 90 seconds
4. Upload to YouTube or similar
5. Add link to submission form

**Outputs**: Demo video ready

---

## Task Dependencies

```
T-301 (OpenAI SDK)
  └─→ T-311 (Agent Definition)
        └─→ T-312 (Agent Runner)
              └─→ T-316 (Agent + MCP Integration)

T-302 (MCP SDK)
  └─→ T-305 (MCP Foundation)
        ├─→ T-306 (add_task)
        ├─→ T-307 (list_tasks)
        ├─→ T-308 (complete_task)
        ├─→ T-309 (delete_task)
        └─→ T-310 (update_task)

T-303, T-304 (DB Models)
  └─→ T-313 (Chat API)
        ├─→ T-314 (Load Conversation)
        ├─→ T-315 (Store Message)
        ├─→ T-317 (Stateless Design)
        └─→ T-318 (JWT Auth)

T-313 (Chat API)
  └─→ T-319 (ChatKit Frontend)
        ├─→ T-320 (Message Display)
        ├─→ T-321 (Input Handling)
        └─→ T-322 (Tool Indicators)

T-306-T-310 (MCP Tools)
  └─→ T-323 (Test MCP Tools)

T-311, T-316 (Agent Integration)
  └─→ T-324 (Test Natural Language)

T-313, T-317
  └─→ T-325 (Test Persistence)

T-320-T-322 (ChatKit)
  ├─→ T-327 (E2E Workflow)
        ├─→ T-328 (README)
        └─→ T-329 (Demo Video)

T-329
  └─→ T-326 (Domain Allowlist)
```

## Progress Checklist

- [x] OpenAI Agents SDK installed
- [x] Official MCP SDK installed
- [x] Conversation model created
- [x] Message model created
- [x] MCP server foundation implemented
- [x] All 5 MCP tools implemented
- [x] Agent definition created
- [x] Agent Runner implemented
- [x] Chat API endpoint created
- [x] Conversation loading functional
- [x] Message storage functional
- [x] Agent integrated with MCP tools
- [x] Stateless design verified
- [x] JWT authentication configured
- [x] ChatKit component created
- [x] Chat UI fully functional
- [ ] All MCP tools tested
- [ ] Natural language commands tested
- [ ] Conversation persistence tested
- [ ] Domain allowlist configured
- [ ] End-to-end workflow tested
- [ ] Documentation complete
- [ ] Demo video recorded

## Time Estimates

| Task | Est. Time | Actual Time | Status |
|-------|-----------|--------------|---------|
| T-301 | 15 min | - | Completed |
| T-302 | 15 min | - | Completed |
| T-303 | 10 min | - | Completed |
| T-304 | 10 min | - | Completed |
| T-305 | 20 min | - | Completed |
| T-306 | 30 min | - | Completed |
| T-307 | 20 min | - | Completed |
| T-308 | 25 min | - | Completed |
| T-309 | 20 min | - | Completed |
| T-310 | 30 min | - | Completed |
| T-311 | 30 min | - | Completed |
| T-312 | 30 min | - | Completed |
| T-313 | 30 min | - | Pending |
| T-314 | 20 min | - | Pending |
| T-315 | 20 min | - | Pending |
| T-316 | 30 min | - | Pending |
| T-317 | 15 min | - | Pending |
| T-318 | 15 min | - | Pending |
| T-319 | 30 min | - | Pending |
| T-320 | 25 min | - | Pending |
| T-321 | 25 min | - | Pending |
| T-322 | 20 min | - | Pending |
| T-323 | 30 min | - | Pending |
| T-324 | 30 min | - | Pending |
| T-325 | 20 min | - | Pending |
| T-326 | 20 min | - | Pending |
| T-327 | 30 min | - | Pending |
| T-328 | 30 min | - | Pending |
| T-329 | 30 min | - | Pending |
| **Total** | **~9 hours** | - | |

## Notes

- All tasks must be completed before Phase III submission
- Use Claude Code for all implementation
- Test natural language extensively
- Demo video MUST be under 90 seconds
- Prepare for Phase IV (containerization)
- Document all Agent and MCP configurations
