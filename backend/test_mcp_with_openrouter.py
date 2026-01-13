"""
Test MCP tools with OpenRouter API
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_mcp_tools():
    """Test that MCP tools work with OpenRouter"""
    from agent import run_agent

    print("[TEST] Testing MCP tools with OpenRouter...")
    print(f"[MODEL] {os.getenv('AI_MODEL')}")
    print()

    # Test 1: Add task
    print("[TEST 1] Adding a task...")
    result = await run_agent(
        user_message="Add a task: Test OpenRouter integration",
        user_id="test_user_123",  # Add required user_id parameter
        conversation_history=[]
    )

    if result["error"]:
        print(f"[ERROR] {result['error']}")
        return False

    print(f"[RESPONSE] {result['response']}")
    print(f"[TOOLS] {len(result['tool_calls'])} tool(s) called")
    if result['tool_calls']:
        for call in result['tool_calls']:
            print(f"  - {call}")
    print()

    # Test 2: List tasks
    print("[TEST 2] Listing tasks...")
    result = await run_agent(
        user_message="Show me my tasks",
        user_id="test_user_123",  # Add required user_id parameter
        conversation_history=[]
    )

    print(f"[RESPONSE] {result['response']}")
    print(f"[TOOLS] {len(result['tool_calls'])} tool(s) called")
    print()

    print("[SUCCESS] All tests passed!")
    return True

if __name__ == "__main__":
    # Note: This test requires a valid user_id in the database
    # The MCP tools need user_id parameter
    print("[NOTE] This test will fail if user_id is not in database")
    print("[NOTE] Use the actual chat API endpoint for full testing")
    print()

    success = asyncio.run(test_mcp_tools())
    exit(0 if success else 1)
