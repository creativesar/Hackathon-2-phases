# Phase III: AI Chatbot - Plan

## Architecture Overview
Add AI-powered conversational interface to Phase II web application using OpenAI ChatKit, Agents SDK, and Official MCP SDK. Stateless chat endpoint with conversation persistence.

```
┌───────────────────────────────────────────────────────────────────┐
│                  Web Browser                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         Frontend - Next.js 16+ (OpenAI ChatKit)    │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │    ChatKit UI Component                          │  │   │
│  │  │  - Message display (user + assistant)           │  │   │
│  │  │  - Input field + Send button                 │  │   │
│  │  │  - Tool call indicators                      │  │   │
│  │  │  - JWT token management                        │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                    │ POST /api/{user_id}/chat                     │
│                    │ (with JWT token)                               │
│                    ▼                                               │
┌───────────────────────────────────────────────────────────────────┐   │
│              Backend - FastAPI (Python)                      │   │
│  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │         Chat Endpoint                                   │   │   │
│  │  POST /api/{user_id}/chat                           │   │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │  1. Load conversation history from DB       │  │   │
│  │  │  2. Store user message in DB                │  │   │
│  │  │  3. Build message array for agent            │  │   │
│  │  │  4. Run OpenAI Agents SDK                  │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                    │                                               │
│                    ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │      OpenAI Agents SDK                                 │   │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │  - Agent (defines behavior, tools)              │  │   │
│  │  │  - Runner (orchestrates execution)            │  │   │
│  │  │  - Tool selection logic                       │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └───────────────┬───────────────────────────────────────────┘   │
│                  │                                               │
│                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │         MCP Server (Official MCP SDK)                 │   │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │  Tool: add_task                              │  │   │
│  │  │  Tool: list_tasks                             │  │   │
│  │  │  Tool: complete_task                         │  │   │
│  │  │  Tool: delete_task                           │  │   │
│  │  │  Tool: update_task                           │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └───────────────┬───────────────────────────────────────────┘   │
│                  │                                               │
│                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Database (Neon PostgreSQL)                 │   │
│  │  - tasks table (from Phase II)                       │   │
│  │  - conversations table (new)                         │   │
│  │  - messages table (new)                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|----------|
| Frontend UI | OpenAI ChatKit | Conversational interface |
| Backend | Python FastAPI | REST API server |
| AI Framework | OpenAI Agents SDK | Agent logic |
| MCP Server | Official MCP SDK | Tool interfaces |
| ORM | SQLModel | Database ORM |
| Database | Neon PostgreSQL | Persistent storage |
| Authentication | Better Auth + JWT | User authentication |

## Component Design

### 1. ChatKit Frontend Component

**Purpose**: Conversational UI for todo management

**Location**: `components/ChatInterface.tsx`

**Features**:
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  tool: string;
  args: any;
  result: any;
}

const ChatInterface = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Send message
  const sendMessage = async () => {
    const response = await fetch('/api/ziakhan/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: input
      })
    });
    const data = await response.json();
    setMessages([...messages, data]);
    setConversationId(data.conversation_id);
  };

  // Render
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(msg => (
          <MessageBubble role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
```

### 2. Chat API Endpoint

**Purpose**: Stateless chat endpoint

**Location**: `backend/app/routes/chat.py`

**Flow**:
```python
@app.post("/api/{user_id}/chat")
async def chat(user_id: str, request: ChatRequest):
    # Step 1: Load or create conversation
    if request.conversation_id:
        conversation = db.get_conversation(request.conversation_id, user_id)
        # Validate user ownership
        if not conversation or conversation.user_id != user_id:
            raise HTTPException(403, "Access denied")
    else:
        conversation = db.create_conversation(user_id)

    # Step 2: Store user message
    user_message = db.create_message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )

    # Step 3: Build message array for agent
    messages = db.get_messages(conversation.id)
    agent_messages = build_agent_messages(messages)

    # Step 4: Run agent with MCP tools
    agent = get_agent()
    response = await agent.run_async(
        messages=agent_messages,
        tools=get_mcp_tools()
    )

    # Step 5: Store assistant response
    assistant_message = db.create_message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="assistant",
        content=response.content,
        tool_calls=response.tool_calls
    )

    # Step 6: Return response (server holds no state)
    return {
        "conversation_id": conversation.id,
        "response": response.content,
        "tool_calls": response.tool_calls
    }
```

### 3. OpenAI Agents SDK Integration

**Purpose**: AI logic and tool orchestration

**Location**: `backend/app/agent.py`

**Agent Definition**:
```python
from openai import Agent, Runner
from mcp_server import get_mcp_tools

# Define agent behavior
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
    Handle errors gracefully and help the user rephrase if needed.
    """,
    tools=get_mcp_tools()  # Get MCP tools
)

async def chat_handler(user_message: str, conversation_history: list):
    # Build messages from history + new input
    messages = conversation_history + [{"role": "user", "content": user_message}]

    # Run agent
    runner = Runner(agent)
    response = await runner.run(messages)

    return response
```

### 4. MCP Server Implementation

**Purpose**: Expose task operations as MCP tools

**Location**: `backend/app/mcp_server.py`

**Tool Definitions**:

#### add_task
```python
@mcp_tool
async def add_task(user_id: str, title: str, description: str = None):
    """Create a new task for the user"""
    # Validate title
    if not title or len(title) < 1 or len(title) > 200:
        raise ValueError("Title must be 1-200 characters")

    if description and len(description) > 1000:
        raise ValueError("Description cannot exceed 1000 characters")

    # Create task in database
    task = db.create_task(
        user_id=user_id,
        title=title,
        description=description
    )

    return {
        "task_id": task.id,
        "status": "created",
        "title": task.title
    }
```

#### list_tasks
```python
@mcp_tool
async def list_tasks(user_id: str, status: str = "all"):
    """Retrieve tasks from the user's list"""
    # Validate status
    if status not in ["all", "pending", "completed"]:
        raise ValueError("Invalid status. Use 'all', 'pending', or 'completed'")

    # Query tasks
    tasks = db.get_tasks(user_id, status=status)

    return tasks
```

#### complete_task
```python
@mcp_tool
async def complete_task(user_id: str, task_id: int):
    """Mark a task as complete"""
    # Validate task exists and belongs to user
    task = db.get_task(task_id)
    if not task:
        raise ValueError("Task not found")
    if task.user_id != user_id:
        raise ValueError("Access denied")

    # Toggle completion
    task.completed = not task.completed
    db.update_task(task)

    return {
        "task_id": task.id,
        "status": "completed" if task.completed else "pending",
        "title": task.title
    }
```

#### delete_task
```python
@mcp_tool
async def delete_task(user_id: str, task_id: int):
    """Remove a task from the list"""
    # Validate task exists and belongs to user
    task = db.get_task(task_id)
    if not task:
        raise ValueError("Task not found")
    if task.user_id != user_id:
        raise ValueError("Access denied")

    # Delete task
    db.delete_task(task_id)

    return {
        "task_id": task.id,
        "status": "deleted",
        "title": task.title
    }
```

#### update_task
```python
@mcp_tool
async def update_task(user_id: str, task_id: int, title: str = None, description: str = None):
    """Modify task title or description"""
    # Validate task exists and belongs to user
    task = db.get_task(task_id)
    if not task:
        raise ValueError("Task not found")
    if task.user_id != user_id:
        raise ValueError("Access denied")

    # Update fields
    if title:
        if len(title) < 1 or len(title) > 200:
            raise ValueError("Title must be 1-200 characters")
        task.title = title

    if description:
        if len(description) > 1000:
            raise ValueError("Description cannot exceed 1000 characters")
        task.description = description

    # Save updates
    db.update_task(task)

    return {
        "task_id": task.id,
        "status": "updated",
        "title": task.title
    }
```

### 5. Database Models

**Purpose**: Store conversations and messages

**Location**: `backend/app/models.py`

```python
from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str  # "user" or "assistant"
    content: str
    tool_calls: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## Stateless Request Cycle

```
1. Client sends: POST /api/{user_id}/chat
   {
     "conversation_id": 123,
     "message": "Add a task to buy groceries"
   }
   ↓
2. Server receives request
   ↓
3. Load conversation from database (or create new)
   ↓
4. Store user message in database
   ↓
5. Fetch all conversation history
   ↓
6. Build message array for agent
   ↓
7. Run OpenAI Agent with MCP tools
   ↓
8. Agent selects tool: add_task
   ↓
9. Agent calls MCP tool
   ↓
10. MCP tool executes: db.create_task()
   ↓
11. MCP tool returns result
   ↓
12. Store assistant response in database
   ↓
13. Return response to client
   ↓
14. Server holds NO state (ready for next request)
```

## Non-Functional Requirements

### Performance
- Chat response time: < 2 seconds
- Tool execution: < 500ms each
- Database queries: < 100ms
- No state held in memory

### Scalability
- Stateless design enables horizontal scaling
- Database connection pooling
- Multiple conversations concurrent

### Reliability
- Conversation recovery on server restart
- Graceful error handling
- Tool timeout handling
- Retry logic for transient failures

### Usability
- Clear, friendly AI responses
- Tool call transparency
- Loading states during processing
- Error messages with suggestions

## Security Considerations

- JWT authentication on all requests
- User ownership validation
- Input sanitization
- SQL injection prevention (ORM)
- Tool parameter validation

## Data Flow

```
User Input (ChatKit)
    ↓ HTTP POST
FastAPI Chat Endpoint
    ↓ JWT Validation
User Authorization
    ↓
Load Conversation (DB)
    ↓
Store User Message (DB)
    ↓
Build Message Array
    ↓
OpenAI Agents SDK
    ↓
Tool Selection
    ↓
MCP Server
    ↓
MCP Tool Execution
    ↓
Database Operations
    ↓
Return Result
    ↓
Store Assistant Response (DB)
    ↓
Return Response to Client
```

## Integration with Phase II

### Inherited
- **FastAPI Server**: From Phase II
- **Task Model**: From Phase II
- **Database**: Neon PostgreSQL
- **Authentication**: JWT from Phase II
- **User API**: User management from Phase II

### New in Phase III
- **ChatKit UI**: Conversational interface
- **Chat API**: New endpoint
- **Agents SDK**: AI logic layer
- **MCP Server**: Tool interface
- **Conversation Models**: New database tables
- **MCP Tools**: 5 task management tools

## Preparation for Phase IV

### Deliverables
- Complete application (frontend + backend + AI)
- All dependencies defined
- Container-ready (Dockerfiles)
- Environment configuration documented

### Key Changes for Phase IV
- Add Dockerfiles
- Create Kubernetes manifests
- Build Helm charts
- Deploy to Minikube

## Decision Records

### DR-001: ChatKit vs Custom UI
**Decision**: Use OpenAI ChatKit
**Rationale**:
- Built-in conversational interface
- Better UX out of the box
- Less development time
- Optimized for AI interactions
- Official OpenAI integration

**Trade-offs**:
- Less customization
- Learning curve for ChatKit API

### DR-002: MCP Server vs Direct Tool Calls
**Decision**: Use MCP Server
**Rationale**:
- Standardized tool interface
- Easier to test and debug
- Reusable across agents
- Separation of concerns
- Industry best practice

**Trade-offs**:
- Additional MCP SDK dependency
- Slightly more complex architecture

### DR-003: Stateless vs Stateful Chat
**Decision**: Stateless server
**Rationale**:
- Horizontal scaling
- Server restart doesn't lose conversations
- Better resilience
- Production-ready

**Trade-offs**:
- Database query per request (slightly slower)
- More complex state management

## Success Criteria

- [ ] ChatKit UI displays correctly
- [ ] Chat API endpoint functional
- [ ] OpenAI Agents SDK integrated
- [ ] MCP server with 5 tools
- [ ] All tools tested
- [ ] Conversations persist to database
- [ ] Stateless design verified
- [ ] Natural language commands work
- [ ] Demo video under 90 seconds
- [ ] Complete specification files

## Clarifications & Decisions

### CLR-001: MCP Tool Organization
**Decision**: Single module with all 5 tools, using decorators
**Rationale**: Centralized management, easier to test, clear organization
**Implementation**:
```python
# app/mcp_server.py
from mcp_sdk import Tool, mcp_tool

@mcp_tool
async def add_task(user_id: str, title: str, description: str = None):
    """Create a new task"""
    # Implementation

@mcp_tool
async def list_tasks(user_id: str, status: str = "all"):
    """Retrieve tasks from user's list"""
    # Implementation

# ... other tools
```

### CLR-002: Agent Model Selection
**Decision**: Use GPT-4o for best performance
**Rationale**: Better natural language understanding, better tool selection, worth cost for demo
**Implementation**:
- Configure agent to use `gpt-4o` model
- Temperature: 0.3 (balanced creativity and accuracy)
- Max tokens: 500 (sufficient for task operations)
- Fallback to GPT-4o-mini if needed for cost

### CLR-003: ChatKit Integration Approach
**Decision**: Add chat page as new route alongside existing dashboard
**Rationale**: Keep Phase II functionality, offer both UI options, smoother migration
**Implementation**:
- `/chat` - New chat interface page
- `/` - Existing dashboard (from Phase II)
- Navigation between both UI modes
- Shared authentication and state

### CLR-004: Message Storage Format
**Decision**: Store tool_calls as JSON string in Message model
**Rationale**: Simple schema, flexible for various tool outputs, SQLModel compatible
**Implementation**:
```python
class Message(SQLModel, table=True):
    id: int | None
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    tool_calls: str | None  # JSON string: '[{"tool": "...", "args": {...}}]'
    created_at: datetime
```

## Next Steps

1. Install OpenAI ChatKit
2. Install OpenAI Agents SDK
3. Install Official MCP SDK
4. Create MCP server
5. Implement chat API endpoint
6. Build ChatKit UI component
7. Create database models
8. Integrate with Phase II backend
9. Test all MCP tools
10. Test natural language commands
11. Test conversation persistence
12. Create demo video
13. Prepare for Phase IV
