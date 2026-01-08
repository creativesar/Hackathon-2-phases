"""
Quick test to verify OpenRouter API connection
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_openrouter():
    """Test OpenRouter API connection with Gemini model"""
    from agent import run_agent

    print("[TEST] Testing OpenRouter API connection...")
    print(f"[MODEL] {os.getenv('AI_MODEL')}")
    print(f"[KEY] {os.getenv('OPENROUTER_API_KEY')[:20]}...")
    print()

    # Simple test message
    result = await run_agent(
        user_message="Hello! Can you help me?",
        conversation_history=[]
    )

    if result["error"]:
        print(f"[ERROR] {result['error']}")
        return False
    else:
        print("[SUCCESS] API connection working!")
        print(f"[RESPONSE] {result['response']}")
        print(f"[TOOLS] Tool calls: {len(result['tool_calls'])}")
        return True

if __name__ == "__main__":
    success = asyncio.run(test_openrouter())
    exit(0 if success else 1)
