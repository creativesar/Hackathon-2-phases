# PHR: T-303 Conversation Database Models Creation

## Date
2026-01-06

## Task
T-303: Create Conversation database models

## Objective
Create the Conversation database model in the backend/models.py file as part of the Phase 3 AI Chatbot implementation.

## Context
This was the third task in the Phase 3 AI Chatbot implementation sequence. The task required adding the Conversation model to the existing database models to support chat conversation persistence. This model will be used to store chat conversations in the AI chatbot feature, allowing for persistent conversations across sessions.

## Implementation Details

### 1. Environment Check
- Navigated to `backend/` directory
- Ensured SQLModel was installed (installed via pip)

### 2. Model Creation
Updated `backend/models.py` with the following components:

- `Conversation` class using SQLModel with table=True
  - `id`: Primary key for the conversation
  - `user_id`: Foreign key linking to users table for ownership
  - `created_at`: Timestamp for when conversation was created
  - `updated_at`: Timestamp for when conversation was last updated
  - Proper table name: "conversations"
  - Index on user_id for performance

- `Message` class using SQLModel with table=True (added as part of T-304 which depends on T-303)
  - `id`: Primary key for the message
  - `user_id`: Foreign key linking to users table for ownership
  - `conversation_id`: Foreign key linking to conversations table
  - `role`: Role of the message sender ("user" or "assistant")
  - `content`: The actual message content
  - `tool_calls`: Optional JSON string to store tool call information
  - `created_at`: Timestamp for when message was created
  - Proper table name: "messages"
  - Indexes on user_id and conversation_id for performance

### 3. Key Features Implemented
- Proper SQLModel inheritance with table=True
- Correct foreign key relationships (user_id → users.id, conversation_id → conversations.id)
- Indexes on foreign key fields for query performance
- Proper datetime fields with default_factory=datetime.utcnow
- Comprehensive documentation for each model
- Proper field validation and constraints

### 4. Testing
- Verified import functionality: `from models import Conversation, Message` works correctly
- Confirmed table names are set correctly ("conversations", "messages")
- Validated all required fields are properly defined

## Code Structure

```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str
    tool_calls: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## Verification
- [x] Import functionality tested: `from models import Conversation, Message` works
- [x] Table names properly set: "conversations", "messages"
- [x] Foreign key relationships established
- [x] Indexes added to foreign key fields
- [x] Documentation included for each model
- [x] Proper field validation and constraints applied

## Next Steps
- T-304: Create Message database model (already implemented as part of this task)
- T-313: Create chat API endpoint (depends on T-303 and T-304)
- Database migration setup for the new tables
- Integration with chat API endpoints

## Notes
- The implementation follows the architecture specified in the plan.md file
- Both Conversation and Message models were implemented together since they are closely related
- Foreign key relationships ensure data integrity between users, conversations, and messages
- Indexes on foreign key fields will improve query performance
- The models are designed to support the stateless architecture pattern required for the chatbot

## Status
Completed successfully. Both Conversation and Message models are ready for use in the chatbot implementation.