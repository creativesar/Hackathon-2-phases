# Phase III: Todo AI Chatbot - Specification

## Overview
Transform Phase II web application into an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture.

**Points**: 200 | **Due Date**: Dec 21, 2025

## Purpose
Add conversational interface to todo application using OpenAI ChatKit, Agents SDK, and Official MCP SDK.

## Dependencies

**Predecessor Phase**: Phase II - Web Application
- Inherits: Backend API (FastAPI), authentication (Better Auth + JWT), database schema (Neon PostgreSQL), web frontend (Next.js)

**Successor Phase**: Phase IV - Kubernetes Deployment
- Provides: Complete application stack ready for containerization

## User Stories

### US-1: Natural Language Task Management
**As a user, I want to manage my todos by speaking naturally, so I don't need to learn UI controls.**

### US-2: Chatbot Context Awareness
**As a user, I want the chatbot to remember our conversation, so I can continue where I left off.**

### US-3: Multi-User Isolation
**As a user, I want the chatbot to only access my tasks, so my data remains private.**

### US-4: Error Recovery
**As a user, I want helpful error messages when I speak unclearly, so I know how to rephrase.**

## Functional Requirements

### FR-1: Conversational Interface
- System shall provide chat interface (OpenAI ChatKit)
- System shall support natural language input for all task operations
- System shall display AI responses in conversation format
- System shall maintain chat history visually

### FR-2: OpenAI Agents Integration
- System shall use OpenAI Agents SDK for AI logic
- System shall use Agent Runner for orchestration
- System shall support tool calling
- System shall maintain agent state

### FR-3: MCP Server
- System shall implement MCP server with Official MCP SDK
- System shall expose task operations as MCP tools
- System shall ensure MCP tools are stateless
- System shall store tool state in database

### FR-4: MCP Tools
System shall expose the following MCP tools:

#### Tool: add_task
- Purpose: Create a new task
- Parameters: `user_id` (string, required), `title` (string, required), `description` (string, optional)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "title": "Buy groceries", "description": "Milk, eggs, bread"}`
  - Output: `{"task_id": 5, "status": "created", "title": "Buy groceries"}`

#### Tool: list_tasks
- Purpose: Retrieve tasks from list
- Parameters: `user_id` (string, required), `status` (string, optional: "all", "pending", "completed")
- Returns: Array of task objects
- Example:
  - Input: `{"user_id": "ziakhan", "status": "pending"}`
  - Output: `[{"id": 1, "title": "Buy groceries", "completed": false}, ...]`

#### Tool: complete_task
- Purpose: Mark a task as complete
- Parameters: `user_id` (string, required), `task_id` (integer, required)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 3}`
  - Output: `{"task_id": 3, "status": "completed", "title": "Call mom"}`

#### Tool: delete_task
- Purpose: Remove task from list
- Parameters: `user_id` (string, required), `task_id` (integer, required)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 2}`
  - Output: `{"task_id": 2, "status": "deleted", "title": "Old task"}`

#### Tool: update_task
- Purpose: Modify task title or description
- Parameters: `user_id` (string, required), `task_id` (integer, required), `title` (string, optional), `description` (string, optional)
- Returns: `task_id`, `status`, `title`
- Example:
  - Input: `{"user_id": "ziakhan", "task_id": 1, "title": "Buy groceries and fruits"}`
  - Output: `{"task_id": 1, "status": "updated", "title": "Buy groceries and fruits"}`

### FR-5: Chat API Endpoint
- Endpoint: `POST /api/{user_id}/chat`
- Parameters: `conversation_id` (optional), `message` (required)
- Returns: `conversation_id`, `response`, `tool_calls`
- System shall be stateless (server holds no conversation state)
- System shall persist conversations to database

### FR-6: Database Models

#### Conversation Model
```python
class Conversation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

#### Message Model
```python
class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    tool_calls: JSON | None = None  # Optional array of tools called
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### FR-7: Stateless Architecture
- Chat endpoint must not hold conversation state in memory
- All conversation state loaded from database on each request
- Conversation state saved to database after each turn
- Enables horizontal scaling

### FR-8: Agent Behavior
System shall support natural language commands:

| User Says | Agent Should |
|-----------|--------------|
| "Add a task to buy groceries" | Call `add_task` with title "Buy groceries" |
| "Show me all my tasks" | Call `list_tasks` with status "all" |
| "What's pending?" | Call `list_tasks` with status "pending" |
| "Mark task 3 as complete" | Call `complete_task` with task_id 3 |
| "Delete the meeting task" | Call `list_tasks` first, then `delete_task` |
| "Change task 1 to 'Call mom tonight'" | Call `update_task` with new title |
| "I need to remember to pay bills" | Call `add_task` with title "Pay bills" |
| "What have I completed?" | Call `list_tasks` with status "completed" |

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|----------|
| Frontend | OpenAI ChatKit | Chat UI framework |
| Backend | Python FastAPI | REST API server |
| AI Framework | OpenAI Agents SDK | Agent logic |
| MCP Server | Official MCP SDK | Tool interfaces |
| ORM | SQLModel | Database ORM |
| Database | Neon PostgreSQL | Persistent storage |
| Authentication | Better Auth + JWT | User authentication |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  ChatKit UI (Frontend)                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │    Chat Interface - OpenAI ChatKit               │  │
│  │  - Message display (user + assistant)            │  │
│  │  - Input field + Send button                      │  │
│  │  - Tool call indicators                          │  │
│  │  - JWT token management                         │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    │ POST /api/{user_id}/chat
                    │ (with JWT token)
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              FastAPI Server (Backend)                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         Chat Endpoint                             │  │
│  │  POST /api/{user_id}/chat                      │  │
│  └───────────────┬────────────────────────────────┘  │
│                  │                                       │
│                  ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │      OpenAI Agents SDK                              │  │
│  │  - Agent (defines behavior)                       │  │
│  │  - Runner (orchestrates execution)                  │  │
│  └───────────────┬────────────────────────────────┘  │
│                  │                                       │
│                  ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         MCP Server                                 │  │
│  │  (MCP Tools for Task Operations)                   │  │
│  │  - add_task                                     │  │
│  │  - list_tasks                                    │  │
│  │  - complete_task                                 │  │
│  │  - delete_task                                   │  │
│  │  - update_task                                   │  │
│  └───────────────┬────────────────────────────────┘  │
└──────────────────┼─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Neon DB (PostgreSQL)                    │
│  - tasks table (from Phase II)                          │
│  - conversations table (new)                             │
│  - messages table (new)                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Chat API Endpoint Details

### Request
```json
{
  "conversation_id": 123,  // Optional - creates new if not provided
  "message": "Add a task to buy groceries"
}
```

### Response
```json
{
  "conversation_id": 123,
  "response": "I've added the task 'Buy groceries' to your list.",
  "tool_calls": [
    {
      "tool": "add_task",
      "args": {
        "user_id": "ziakhan",
        "title": "Buy groceries"
      },
      "result": {
        "task_id": 5,
        "status": "created"
      }
    }
  ]
}
```

## Stateless Request Cycle

```
1. Receive user message
   ↓
2. Fetch conversation history from database
   ↓
3. Build message array for agent (history + new message)
   ↓
4. Store user message in database
   ↓
5. Run agent with MCP tools
   ↓
6. Agent invokes appropriate MCP tool(s)
   ↓
7. Store assistant response in database
   ↓
8. Return response to client
   ↓
9. Server holds NO state (ready for next request)
```

## Non-Functional Requirements

### NFR-1: Performance
- Chat response time: < 2 seconds
- Tool execution: < 500ms each
- Database queries: < 100ms

### NFR-2: Scalability
- Stateless server design
- Horizontal scaling support
- Database connection pooling

### NFR-3: Reliability
- Graceful error handling
- Retry logic for failed tool calls
- Conversation recovery on restart

### NFR-4: Usability
- Clear, friendly AI responses
- Tool call transparency
- Error messages with helpful suggestions

## Acceptance Criteria

### AC-1: Chatbot Interface
- [ ] ChatKit UI displays correctly
- [ ] User can send messages
- [ ] AI responses displayed
- [ ] Tool calls shown when invoked

### AC-2: Natural Language Commands
- [ ] "Add task" works via `add_task` tool
- [ ] "Show tasks" works via `list_tasks` tool
- [ ] "Mark complete" works via `complete_task` tool
- [ ] "Delete task" works via `delete_task` tool
- [ ] "Update task" works via `update_task` tool

### AC-3: MCP Tools
- [ ] All 5 tools implemented
- [ ] Tools are stateless
- [ ] Tools validate inputs
- [ ] Tools return proper JSON

### AC-4: Chat API
- [ ] POST /api/{user_id}/chat endpoint works
- [ ] New conversations created when ID not provided
- [ ] Existing conversations resumed when ID provided
- [ ] JWT authentication required

### AC-5: Database Persistence
- [ ] Conversations saved to database
- [ ] Messages saved with conversation_id
- [ ] Conversations can be resumed after server restart
- [ ] Tool calls logged

### AC-6: Agent Behavior
- [ ] Agent interprets natural language correctly
- [ ] Agent selects appropriate tools
- [ ] Agent provides confirmation messages
- [ ] Agent handles task not found gracefully

### AC-7: User Isolation
- [ ] Users only see their own conversations
- [ ] Tools only operate on user's tasks
- [ ] JWT prevents cross-user access

### AC-8: Error Handling
- [ ] Invalid tool calls caught and reported
- [ ] Database errors handled gracefully
- [ ] Network errors show user-friendly messages

### AC-9: Domain Allowlist
- [ ] Frontend domain added to OpenAI allowlist
- [ ] Domain key configured
- [ ] ChatKit works in production

### AC-10: Deployment
- [ ] Chatbot deployed and accessible
- [ ] Demo video under 90 seconds
- [ ] All features demonstrated

## Out of Scope

- Voice commands (Bonus feature)
- Multi-language support/Urdu (Bonus feature)
- Advanced task features (priorities, tags - Phase V)
- Real-time multi-client sync (Phase V)

## Related Bonus Features

### Bonus 1: Reusable Intelligence (+200)
Create Claude Code subagents and Agent Skills for:
- Spec generation automation
- Task breakdown automation
- MCP tool code generation patterns
- Deployment automation

**Relevant to Phase III**: Yes - can create skills for MCP tool generation, agent configuration

### Bonus 2: Cloud-Native Blueprints (+200)
Create spec-driven deployment blueprints via Agent Skills
**Relevant to Phase III**: Not directly applicable (deployment in Phase IV)

### Bonus 3: Multi-language Support/Urdu (+100)
Add Urdu language support in chatbot prompts
**Relevant to Phase III**: Yes - chatbot phase
**Implementation**:
- Add Urdu translations for prompts
- Support Urdu user input
- AI responds in Urdu when requested

### Bonus 4: Voice Commands (+200)
Integrate Web Speech API for voice input
**Relevant to Phase III**: Yes - chatbot phase
**Implementation**:
- Add microphone button to chat interface
- Use Web Speech API for speech-to-text
- Send transcribed text to chat endpoint
- Provide audio feedback

## Integration with Phase II

### Inherited from Phase II
- **Backend API**: FastAPI structure
- **Database**: Neon PostgreSQL + SQLModel
- **Authentication**: Better Auth + JWT
- **Task Model**: Existing schema

### New in Phase III
- **ChatKit UI**: Replace/add chat interface
- **Agents SDK**: AI logic layer
- **MCP Server**: Tool interface
- **Conversation/Message Models**: New database tables
- **Chat Endpoint**: New API endpoint
- **Agent Integration**: Connect AI to existing task operations

## Preparation for Phase IV

### Deliverables for Phase IV
- Complete application stack (frontend + backend + AI)
- All dependencies defined in package files
- Environment configuration documented
- Application tested and working

### Key Changes for Phase IV
- Containerize frontend and backend (Docker)
- Create Kubernetes manifests
- Build Helm charts
- Configure Minikube deployment

## Constraints

- Must use Spec-Driven Development
- No manual coding allowed
- Must use OpenAI ChatKit for UI
- Must use OpenAI Agents SDK
- Must use Official MCP SDK
- Chat endpoint must be stateless
- All MCP tools must be stateless

## Success Metrics

- Chatbot responds to natural language
- All 5 MCP tools working
- Conversations persist across restarts
- Demo video under 90 seconds
- Complete specification files

## OpenAI ChatKit Setup

### Domain Allowlist Configuration
Before deploying to production, configure OpenAI's domain allowlist:

1. **Deploy frontend first** to get production URL
2. **Add domain to OpenAI**: https://platform.openai.com/settings/organization/security/domain-allowlist
3. **Add your domain** (without trailing slash)
4. **Get domain key** from OpenAI

### Environment Variables
```bash
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key-here
```

**Note**: Local development (`localhost`) typically works without this configuration.

## Testing Requirements

- Test all natural language command variations
- Test conversation resume
- Test tool calling
- Test error scenarios
- Test user isolation
- Test with multiple users simultaneously

## Deployment

- Frontend with ChatKit integrated
- Backend with Agents SDK + MCP server
- Domain allowlist configured
- Environment variables set
- Demo ready

## Clarifications & Decisions

### CLR-001: MCP Server Architecture
**Decision**: MCP server runs as separate module within FastAPI app
**Rationale**: Simplified deployment, shared database connection, same authentication
**Implementation**:
- `app/mcp_server.py` - MCP server implementation
- MCP tools use same database models as API
- Tools validate user_id (from JWT) before operations
- Tool handlers call existing service layer (reuse Phase II logic)

### CLR-002: Agent Instructions Strategy
**Decision**: Comprehensive system prompt with tool descriptions
**Rationale**: Better natural language understanding, clearer tool selection, fewer errors
**Implementation**:
- System prompt explains tool capabilities clearly
- Tool descriptions include parameters and examples
- Agent trained to confirm before executing destructive operations
- Error handling prompts agent to rephrase or ask for clarification

### CLR-003: Conversation Limit
**Decision**: Maximum 50 messages per conversation, automatic cleanup after 24 hours
**Rationale**: Performance optimization, prevent runaway storage, privacy-focused
**Implementation**:
- Limit messages fetched per conversation (last 50)
- Cron job or API endpoint to delete old conversations
- UI prompts to start new conversation if approaching limit
- Graceful handling of deleted conversations

### CLR-004: Tool Call Display
**Decision**: Show tool calls in chat UI as expandable cards
**Rationale**: Transparency, user understands what AI is doing, debug assistance
**Implementation**:
- Tool name displayed prominently
- Parameters shown (sensitive data masked if needed)
- Result shown in collapsible details
- Color-coded by tool type (read vs write operations)

## Notes

- This is critical phase - adds AI capabilities
- Focus on natural language understanding
- Test various phrasings of same intent
- Prepare MCP tools for Phase IV containerization
- Bonus features connect strongly to this phase (voice, Urdu)
