"""
Test script for all 5 MCP tools via chat endpoint
Tests the complete flow with OpenRouter integration
"""

import asyncio
import httpx
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
TEST_EMAIL = f"test_mcp_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
TEST_PASSWORD = "TestPassword123!"
TEST_NAME = "MCP Test User"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}[OK] {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}[ERROR] {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}[INFO] {msg}{Colors.END}")

def print_warning(msg):
    print(f"{Colors.YELLOW}[WARN] {msg}{Colors.END}")

async def create_test_user():
    """Create a test user account"""
    print_info("Creating test user...")
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{BASE_URL}/api/auth/signup",
                json={
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD,
                    "name": TEST_NAME
                }
            )

            if response.status_code == 200:
                data = response.json()
                print_success(f"Test user created: {TEST_EMAIL}")
                return data["token"], data["user"]["id"]
            else:
                print_error(f"Failed to create user: {response.status_code}")
                print_error(response.text)
                return None, None
        except Exception as e:
            print_error(f"Error creating user: {e}")
            import traceback
            traceback.print_exc()
            return None, None

async def send_chat_message(token, user_id, message, conversation_id=None):
    """Send a message to the chat endpoint"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            payload = {"message": message}
            if conversation_id:
                payload["conversation_id"] = conversation_id

            response = await client.post(
                f"{BASE_URL}/api/{user_id}/chat",
                headers={"Authorization": f"Bearer {token}"},
                json=payload
            )

            if response.status_code == 200:
                return response.json()
            else:
                print_error(f"Chat request failed: {response.status_code}")
                print_error(response.text)
                return None
        except Exception as e:
            print_error(f"Error sending chat message: {e}")
            return None

async def test_add_task(token, user_id, conversation_id):
    """Test add_task MCP tool"""
    print_info("\n=== Testing add_task tool ===")

    test_cases = [
        "Add a task to buy groceries",
        "I need to remember to call mom",
        "Create a task for submitting the report"
    ]

    for i, message in enumerate(test_cases, 1):
        print_info(f"Test {i}: {message}")
        result = await send_chat_message(token, user_id, message, conversation_id)

        if result:
            print_success(f"Response: {result['response']}")
            if result.get('tool_calls'):
                print_success(f"Tool called: {result['tool_calls']}")
            conversation_id = result.get('conversation_id', conversation_id)
        else:
            print_error(f"Test {i} failed")

        await asyncio.sleep(1)

    return conversation_id

async def test_list_tasks(token, user_id, conversation_id):
    """Test list_tasks MCP tool"""
    print_info("\n=== Testing list_tasks tool ===")

    test_cases = [
        "Show me all my tasks",
        "What's on my todo list?",
        "List my pending tasks"
    ]

    for i, message in enumerate(test_cases, 1):
        print_info(f"Test {i}: {message}")
        result = await send_chat_message(token, user_id, message, conversation_id)

        if result:
            print_success(f"Response: {result['response']}")
            if result.get('tool_calls'):
                print_success(f"Tool called: {result['tool_calls']}")
        else:
            print_error(f"Test {i} failed")

        await asyncio.sleep(1)

    return conversation_id

async def test_complete_task(token, user_id, conversation_id):
    """Test complete_task MCP tool"""
    print_info("\n=== Testing complete_task tool ===")

    test_cases = [
        "Mark task 1 as complete",
        "I finished task 2",
        "Task 3 is done"
    ]

    for i, message in enumerate(test_cases, 1):
        print_info(f"Test {i}: {message}")
        result = await send_chat_message(token, user_id, message, conversation_id)

        if result:
            print_success(f"Response: {result['response']}")
            if result.get('tool_calls'):
                print_success(f"Tool called: {result['tool_calls']}")
        else:
            print_error(f"Test {i} failed")

        await asyncio.sleep(1)

    return conversation_id

async def test_update_task(token, user_id, conversation_id):
    """Test update_task MCP tool"""
    print_info("\n=== Testing update_task tool ===")

    test_cases = [
        "Change task 1 to 'Buy organic groceries'",
        "Update task 2 to 'Call mom tonight'",
        "Rename task 3 to 'Submit report by Friday'"
    ]

    for i, message in enumerate(test_cases, 1):
        print_info(f"Test {i}: {message}")
        result = await send_chat_message(token, user_id, message, conversation_id)

        if result:
            print_success(f"Response: {result['response']}")
            if result.get('tool_calls'):
                print_success(f"Tool called: {result['tool_calls']}")
        else:
            print_error(f"Test {i} failed")

        await asyncio.sleep(1)

    return conversation_id

async def test_delete_task(token, user_id, conversation_id):
    """Test delete_task MCP tool"""
    print_info("\n=== Testing delete_task tool ===")

    test_cases = [
        "Delete task 1",
        "Remove task 2",
        "Cancel task 3"
    ]

    for i, message in enumerate(test_cases, 1):
        print_info(f"Test {i}: {message}")
        result = await send_chat_message(token, user_id, message, conversation_id)

        if result:
            print_success(f"Response: {result['response']}")
            if result.get('tool_calls'):
                print_success(f"Tool called: {result['tool_calls']}")
        else:
            print_error(f"Test {i} failed")

        await asyncio.sleep(1)

    return conversation_id

async def main():
    """Main test runner"""
    print_info("=" * 60)
    print_info("MCP Tools Test Suite - OpenRouter Integration")
    print_info("=" * 60)

    # Step 1: Create test user
    token, user_id = await create_test_user()
    if not token or not user_id:
        print_error("Failed to create test user. Exiting.")
        return

    print_success(f"Authenticated as user: {user_id}")

    # Step 2: Test all MCP tools
    conversation_id = None

    try:
        # Test 1: add_task
        conversation_id = await test_add_task(token, user_id, conversation_id)

        # Test 2: list_tasks
        conversation_id = await test_list_tasks(token, user_id, conversation_id)

        # Test 3: complete_task
        conversation_id = await test_complete_task(token, user_id, conversation_id)

        # Test 4: update_task
        conversation_id = await test_update_task(token, user_id, conversation_id)

        # Test 5: delete_task
        conversation_id = await test_delete_task(token, user_id, conversation_id)

        # Final summary
        print_info("\n" + "=" * 60)
        print_success("All MCP tools tested successfully!")
        print_info(f"Conversation ID: {conversation_id}")
        print_info(f"Test user: {TEST_EMAIL}")
        print_info("=" * 60)

    except Exception as e:
        print_error(f"Test suite failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
