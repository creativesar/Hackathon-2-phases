"""
Test chat API endpoint with OpenRouter and token limits
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_chat_endpoint():
    """Test the actual chat endpoint that will be used by frontend"""
    from agent import run_agent

    print("[TEST] Testing Chat API with OpenRouter (Token Limit: 1000)")
    print(f"[MODEL] {os.getenv('AI_MODEL')}")
    print(f"[MAX_TOKENS] {os.getenv('MAX_TOKENS')}")
    print()

    # Simulate a real user conversation
    conversation = []

    # Test 1: Simple greeting
    print("[TEST 1] Simple greeting...")
    result = await run_agent("Hello, can you help me manage my tasks?", conversation)

    if result["error"]:
        print(f"[FAILED] {result['error']}")
        return False

    print(f"[SUCCESS] {result['response'][:100]}...")
    conversation.append({"role": "user", "content": "Hello, can you help me manage my tasks?"})
    conversation.append({"role": "assistant", "content": result['response']})
    print()

    # Test 2: Add task (will trigger tool call)
    print("[TEST 2] Add task command...")
    result = await run_agent("Add a task: Buy groceries", conversation)

    if result["error"]:
        if "402" in str(result["error"]):
            print(f"[FAILED] 402 Error still occurring: {result['error']}")
            return False
        print(f"[FAILED] {result['error']}")
        return False

    print(f"[SUCCESS] {result['response'][:100]}...")
    print(f"[TOOLS] {len(result['tool_calls'])} tool(s) called")
    print()

    # Test 3: List tasks
    print("[TEST 3] List tasks command...")
    result = await run_agent("Show me my tasks", conversation)

    if result["error"]:
        if "402" in str(result["error"]):
            print(f"[FAILED] 402 Error still occurring: {result['error']}")
            return False
        print(f"[FAILED] {result['error']}")
        return False

    print(f"[SUCCESS] {result['response'][:100]}...")
    print()

    print("[ALL TESTS PASSED] No 402 errors! Token limits working correctly.")
    return True

if __name__ == "__main__":
    success = asyncio.run(test_chat_endpoint())
    exit(0 if success else 1)
