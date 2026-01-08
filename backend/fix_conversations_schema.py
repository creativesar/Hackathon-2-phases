"""
Fix conversations table schema - ensure id is auto-incrementing
Python 3.13+ compatible
"""

import asyncio
from sqlalchemy import text
from db import engine

async def fix_schema():
    """Fix the conversations table to have auto-incrementing id"""
    async with engine.begin() as conn:
        print("Checking current conversations table schema...")

        # Check if table exists
        result = await conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'conversations'
            );
        """))
        table_exists = result.scalar()

        if table_exists:
            print("Conversations table exists. Checking schema...")

            # Check current id column definition
            result = await conn.execute(text("""
                SELECT column_default
                FROM information_schema.columns
                WHERE table_name = 'conversations' AND column_name = 'id';
            """))
            current_default = result.scalar()
            print(f"Current id column default: {current_default}")

            if current_default and "nextval" in str(current_default):
                print("[OK] ID column is already auto-incrementing")
            else:
                print("[FIX] ID column is NOT auto-incrementing. Fixing...")

                # Drop and recreate the table with proper schema
                print("Dropping conversations table...")
                await conn.execute(text("DROP TABLE IF EXISTS messages CASCADE;"))
                await conn.execute(text("DROP TABLE IF EXISTS conversations CASCADE;"))

                print("Recreating conversations table with SERIAL id...")
                await conn.execute(text("""
                    CREATE TABLE conversations (
                        id SERIAL PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW(),
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    );
                """))

                print("Recreating messages table...")
                await conn.execute(text("""
                    CREATE TABLE messages (
                        id SERIAL PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        conversation_id INTEGER NOT NULL,
                        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
                        content TEXT NOT NULL,
                        tool_calls TEXT,
                        created_at TIMESTAMP DEFAULT NOW(),
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
                    );
                """))

                print("Creating indexes...")
                await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);"))
                await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);"))
                await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);"))
                await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);"))

                print("[OK] Schema fixed successfully!")
        else:
            print("Conversations table does not exist. Creating...")
            await conn.execute(text("""
                CREATE TABLE conversations (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """))

            await conn.execute(text("""
                CREATE TABLE messages (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    conversation_id INTEGER NOT NULL,
                    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
                    content TEXT NOT NULL,
                    tool_calls TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
                );
            """))

            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);"))

            print("[OK] Tables created successfully!")

    await engine.dispose()
    print("\nDone! You can now run the tests again.")

if __name__ == "__main__":
    asyncio.run(fix_schema())
