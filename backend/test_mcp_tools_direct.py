"""
Direct MCP Tools Test - Bypass Agent to Test Core Functionality
This test directly calls the MCP tools without going through the AI agent,
allowing us to verify the tools work correctly without needing OpenRouter credits.
"""

import asyncio
import sys
from datetime import datetime

# Add backend to path
sys.path.insert(0, '.')

from mcp_server import (
    add_task,
    list_tasks,
    complete_task,
    delete_task,
    update_task
)

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

def print_test(msg):
    print(f"{Colors.YELLOW}[TEST] {msg}{Colors.END}")

async def test_add_task_tool():
    """Test the add_task MCP tool directly"""
    print_info("\n=== Testing add_task Tool ===")

    test_user_id = "test_user_direct_mcp"

    # Test 1: Add task with title only
    print_test("Test 1: Add task with title only")
    try:
        result = await add_task(test_user_id, "Buy groceries")
        assert result["status"] == "created"
        assert "task_id" in result
        assert result["title"] == "Buy groceries"
        print_success(f"Created task: {result}")
        task_id_1 = result["task_id"]
    except Exception as e:
        print_error(f"Test 1 failed: {e}")
        return False

    # Test 2: Add task with title and description
    print_test("Test 2: Add task with title and description")
    try:
        result = await add_task(test_user_id, "Call mom", "Remember to call mom tonight")
        assert result["status"] == "created"
        assert "task_id" in result
        assert result["title"] == "Call mom"
        print_success(f"Created task: {result}")
        task_id_2 = result["task_id"]
    except Exception as e:
        print_error(f"Test 2 failed: {e}")
        return False

    # Test 3: Add task with long description
    print_test("Test 3: Add task with long description")
    try:
        result = await add_task(
            test_user_id,
            "Submit report",
            "Complete the quarterly report with all financial data and submit by Friday"
        )
        assert result["status"] == "created"
        assert "task_id" in result
        print_success(f"Created task: {result}")
        task_id_3 = result["task_id"]
    except Exception as e:
        print_error(f"Test 3 failed: {e}")
        return False

    print_success("add_task tool: ALL TESTS PASSED")
    return True, [task_id_1, task_id_2, task_id_3]


async def test_list_tasks_tool(user_id):
    """Test the list_tasks MCP tool directly"""
    print_info("\n=== Testing list_tasks Tool ===")

    # Test 1: List all tasks
    print_test("Test 1: List all tasks")
    try:
        result = await list_tasks(user_id, "all")
        assert isinstance(result, list)
        assert len(result) >= 3  # We created 3 tasks
        print_success(f"Listed {len(result)} tasks")
        for task in result:
            print_info(f"  - Task {task['id']}: {task['title']} (completed: {task['completed']})")
    except Exception as e:
        print_error(f"Test 1 failed: {e}")
        return False

    # Test 2: List pending tasks
    print_test("Test 2: List pending tasks")
    try:
        result = await list_tasks(user_id, "pending")
        assert isinstance(result, list)
        assert all(not task["completed"] for task in result)
        print_success(f"Listed {len(result)} pending tasks")
    except Exception as e:
        print_error(f"Test 2 failed: {e}")
        return False

    # Test 3: List completed tasks (should be empty initially)
    print_test("Test 3: List completed tasks")
    try:
        result = await list_tasks(user_id, "completed")
        assert isinstance(result, list)
        print_success(f"Listed {len(result)} completed tasks")
    except Exception as e:
        print_error(f"Test 3 failed: {e}")
        return False

    print_success("list_tasks tool: ALL TESTS PASSED")
    return True


async def test_complete_task_tool(user_id, task_ids):
    """Test the complete_task MCP tool directly"""
    print_info("\n=== Testing complete_task Tool ===")

    # Test 1: Complete first task
    print_test(f"Test 1: Complete task {task_ids[0]}")
    try:
        result = await complete_task(user_id, task_ids[0])
        assert result["status"] == "completed"
        assert result["task_id"] == task_ids[0]
        print_success(f"Completed task: {result}")
    except Exception as e:
        print_error(f"Test 1 failed: {e}")
        return False

    # Test 2: Toggle task back to pending
    print_test(f"Test 2: Toggle task {task_ids[0]} back to pending")
    try:
        result = await complete_task(user_id, task_ids[0])
        assert result["status"] == "pending"
        assert result["task_id"] == task_ids[0]
        print_success(f"Toggled task: {result}")
    except Exception as e:
        print_error(f"Test 2 failed: {e}")
        return False

    # Test 3: Complete second task
    print_test(f"Test 3: Complete task {task_ids[1]}")
    try:
        result = await complete_task(user_id, task_ids[1])
        assert result["status"] == "completed"
        print_success(f"Completed task: {result}")
    except Exception as e:
        print_error(f"Test 3 failed: {e}")
        return False

    print_success("complete_task tool: ALL TESTS PASSED")
    return True


async def test_update_task_tool(user_id, task_ids):
    """Test the update_task MCP tool directly"""
    print_info("\n=== Testing update_task Tool ===")

    # Test 1: Update task title
    print_test(f"Test 1: Update task {task_ids[0]} title")
    try:
        result = await update_task(user_id, task_ids[0], title="Buy organic groceries")
        assert result["status"] == "updated"
        assert result["title"] == "Buy organic groceries"
        print_success(f"Updated task: {result}")
    except Exception as e:
        print_error(f"Test 1 failed: {e}")
        return False

    # Test 2: Update task description
    print_test(f"Test 2: Update task {task_ids[1]} description")
    try:
        result = await update_task(
            user_id,
            task_ids[1],
            description="Call mom tonight at 7pm"
        )
        assert result["status"] == "updated"
        print_success(f"Updated task: {result}")
    except Exception as e:
        print_error(f"Test 2 failed: {e}")
        return False

    # Test 3: Update both title and description
    print_test(f"Test 3: Update task {task_ids[2]} title and description")
    try:
        result = await update_task(
            user_id,
            task_ids[2],
            title="Submit Q4 report",
            description="Complete and submit by Friday EOD"
        )
        assert result["status"] == "updated"
        assert result["title"] == "Submit Q4 report"
        print_success(f"Updated task: {result}")
    except Exception as e:
        print_error(f"Test 3 failed: {e}")
        return False

    print_success("update_task tool: ALL TESTS PASSED")
    return True


async def test_delete_task_tool(user_id, task_ids):
    """Test the delete_task MCP tool directly"""
    print_info("\n=== Testing delete_task Tool ===")

    # Test 1: Delete first task
    print_test(f"Test 1: Delete task {task_ids[0]}")
    try:
        result = await delete_task(user_id, task_ids[0])
        assert result["status"] == "deleted"
        assert result["task_id"] == task_ids[0]
        print_success(f"Deleted task: {result}")
    except Exception as e:
        print_error(f"Test 1 failed: {e}")
        return False

    # Test 2: Delete second task
    print_test(f"Test 2: Delete task {task_ids[1]}")
    try:
        result = await delete_task(user_id, task_ids[1])
        assert result["status"] == "deleted"
        print_success(f"Deleted task: {result}")
    except Exception as e:
        print_error(f"Test 2 failed: {e}")
        return False

    # Test 3: Delete third task
    print_test(f"Test 3: Delete task {task_ids[2]}")
    try:
        result = await delete_task(user_id, task_ids[2])
        assert result["status"] == "deleted"
        print_success(f"Deleted task: {result}")
    except Exception as e:
        print_error(f"Test 3 failed: {e}")
        return False

    # Test 4: Verify all tasks deleted
    print_test("Test 4: Verify all tasks deleted")
    try:
        result = await list_tasks(user_id, "all")
        assert len(result) == 0
        print_success("All tasks successfully deleted")
    except Exception as e:
        print_error(f"Test 4 failed: {e}")
        return False

    print_success("delete_task tool: ALL TESTS PASSED")
    return True


async def main():
    """Main test runner"""
    print_info("=" * 60)
    print_info("Direct MCP Tools Test Suite")
    print_info("Testing MCP tools without AI agent")
    print_info("=" * 60)

    test_user_id = "test_user_direct_mcp"

    try:
        # Test 1: add_task
        success, task_ids = await test_add_task_tool()
        if not success:
            print_error("add_task tests failed. Stopping.")
            return

        # Test 2: list_tasks
        success = await test_list_tasks_tool(test_user_id)
        if not success:
            print_error("list_tasks tests failed. Stopping.")
            return

        # Test 3: complete_task
        success = await test_complete_task_tool(test_user_id, task_ids)
        if not success:
            print_error("complete_task tests failed. Stopping.")
            return

        # Test 4: update_task
        success = await test_update_task_tool(test_user_id, task_ids)
        if not success:
            print_error("update_task tests failed. Stopping.")
            return

        # Test 5: delete_task
        success = await test_delete_task_tool(test_user_id, task_ids)
        if not success:
            print_error("delete_task tests failed. Stopping.")
            return

        # Final summary
        print_info("\n" + "=" * 60)
        print_success("ALL MCP TOOLS TESTED SUCCESSFULLY!")
        print_info("=" * 60)
        print_success("✓ add_task: 3/3 tests passed")
        print_success("✓ list_tasks: 3/3 tests passed")
        print_success("✓ complete_task: 3/3 tests passed")
        print_success("✓ update_task: 3/3 tests passed")
        print_success("✓ delete_task: 4/4 tests passed")
        print_info("=" * 60)
        print_success("Total: 16/16 tests passed")
        print_info("=" * 60)

    except Exception as e:
        print_error(f"Test suite failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
