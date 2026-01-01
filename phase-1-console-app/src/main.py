"""Main CLI application for Todo Console App

Entry point with menu system and user input handling.
"""

from repository import TaskRepository
from services import TaskService
from models import Task


# Color constants for terminal output
class Colors:
    """ANSI color codes for terminal output."""
    RESET = '\033[0m'
    GREEN = '\033[92m'  # Bright green
    RED = '\033[91m'  # Bright red
    YELLOW = '\033[93m'  # Bright yellow
    BLUE = '\033[94m'  # Bright blue
    BOLD = '\033[1m'


# Menu constant
MENU = """
=== Todo App (Phase I) ===
1. Add Task
2. List Tasks
3. Update Task
4. Delete Task
5. Mark Task Complete
6. Exit
"""


def display_menu() -> None:
    """Display the main menu options."""
    print(Colors.BLUE + MENU + Colors.RESET)


def get_user_choice() -> int:
    """Get and validate user menu choice.

    Returns:
        int: Validated menu choice (1-6)

    Raises:
        ValueError: If input is not a valid number
    """
    try:
        choice = input("\nEnter your choice (1-6): ").strip()
        if not choice:
            raise ValueError("Choice cannot be empty")

        choice_num = int(choice)
        if 1 <= choice_num <= 6:
            return choice_num
        raise ValueError("Please enter a number between 1 and 6")
    except ValueError:
        raise ValueError("Invalid input. Please enter a number (1-6).")


def display_tasks(tasks: list[Task]) -> None:
    """Display all tasks in formatted list.

    Args:
        tasks (list[Task]): List of tasks to display
    """
    if not tasks:
        print(Colors.YELLOW + "\nNo tasks yet. Create your first task!" + Colors.RESET)
        return

    print(f"\nTotal tasks: {len(tasks)}\n")
    print("-" * 70)

    for task in tasks:
        status_icon = Colors.GREEN + "✓" + Colors.RESET if task.completed else Colors.RED + "✗" + Colors.RESET
        date_str = task.created_at.strftime("%Y-%m-%d %H:%M:%S")

        print(f"[{Colors.BOLD}{task.id}{Colors.RESET}] {status_icon} {task.title}")

        if task.description:
            print(f"    Description: {task.description}")

        print(f"    Created: {date_str}")
        print("-" * 70)


def get_task_input() -> tuple[str, str]:
    """Get task title and description from user.

    Returns:
        tuple[str, str]: (title, description)
    """
    print()
    title = input("Enter task title: ").strip()

    description = input("Enter task description (optional, press Enter to skip): ").strip()
    return title, description


def get_task_id() -> int:
    """Get and validate task ID from user.

    Returns:
        int: Validated task ID

    Raises:
        ValueError: If input is not a valid number
    """
    try:
        task_id_str = input("Enter task ID: ").strip()
        if not task_id_str:
            raise ValueError("Task ID cannot be empty")

        task_id = int(task_id_str)
        if task_id < 1:
            raise ValueError("Task ID must be a positive number")

        return task_id
    except ValueError:
        raise ValueError("Invalid task ID. Please enter a valid number.")


def add_task_handler(service: TaskService) -> None:
    """Handle adding a new task.

    Args:
        service (TaskService): Service instance for task operations
    """
    print("\n--- Add New Task ---")
    title, description = get_task_input()

    try:
        task = service.add_task(title, description)
        print(Colors.GREEN + f"\nTask added successfully!" + Colors.RESET)
        print(f"  ID: {task.id}")
        print(f"  Title: {task.title}")
        if description:
            print(f"  Description: {description}")
    except ValueError as e:
        print(Colors.RED + f"\nError: {e}" + Colors.RESET)


def update_task_handler(service: TaskService) -> None:
    """Handle updating an existing task.

    Args:
        service (TaskService): Service instance for task operations
    """
    print("\n--- Update Task ---")

    # Show current tasks
    tasks = service.list_tasks()
    display_tasks(tasks)

    if not tasks:
        return

    # Get task ID
    try:
        task_id = get_task_id()

        # Show current task details
        task = service.get_by_id(task_id)
        if not task:
            print(Colors.RED + f"\nTask with ID {task_id} not found!" + Colors.RESET)
            return

        print(f"\nCurrent task:")
        print(f"  Title: {task.title}")
        if task.description:
            print(f"  Description: {task.description}")
        print(f"  Status: {'Completed' if task.completed else 'Pending'}")

        # Get new values
        print("\nEnter new values (leave blank to keep current):")
        new_title = input(f"  Title [{task.title}]: ").strip()
        new_description = input(f"  Description [{task.description or '(none)'}]: ").strip()

        # Update if at least one field provided
        if not new_title and not new_description:
            print(Colors.YELLOW + "No changes made. Task unchanged." + Colors.RESET)
            return

        try:
            updated_task = service.update_task(task_id, new_title or None, new_description or None)
            print(Colors.GREEN + f"\nTask updated successfully!" + Colors.RESET)
            print(f"  ID: {updated_task.id}")
            print(f"  Title: {updated_task.title}")
            if updated_task.description:
                print(f"  Description: {updated_task.description}")
        except ValueError as e:
            print(Colors.RED + f"\nError: {e}" + Colors.RESET)

    except ValueError as e:
        print(Colors.RED + f"\nError: {e}" + Colors.RESET)


def delete_task_handler(service: TaskService) -> None:
    """Handle deleting a task with confirmation.

    Args:
        service (TaskService): Service instance for task operations
    """
    print("\n--- Delete Task ---")

    # Show current tasks
    tasks = service.list_tasks()
    display_tasks(tasks)

    if not tasks:
        return

    # Get task ID
    try:
        task_id = get_task_id()

        # Find and show task details
        task = service.get_by_id(task_id)
        if not task:
            print(Colors.RED + f"\nTask with ID {task_id} not found!" + Colors.RESET)
            return

        print(f"\nTask to delete:")
        print(f"  ID: {task.id}")
        print(f"  Title: {task.title}")
        if task.description:
            print(f"  Description: {task.description}")

        # Confirm deletion
        confirm = input(f"\nDelete this task? (y/n): ").strip().lower()
        if confirm in ('y', 'yes'):
            if service.delete_task(task_id):
                print(Colors.GREEN + f"\nTask deleted successfully!" + Colors.RESET)
                print(f"  ID: {task.id}")
                print(f"  Title: {task.title}")
            else:
                print(Colors.RED + "\nFailed to delete task." + Colors.RESET)
        else:
            print(Colors.YELLOW + "\nDeletion cancelled." + Colors.RESET)

    except ValueError as e:
        print(Colors.RED + f"\nError: {e}" + Colors.RESET)


def toggle_complete_handler(service: TaskService) -> None:
    """Handle toggling task completion status.

    Args:
        service (TaskService): Service instance for task operations
    """
    print("\n--- Mark Task Complete ---")

    # Show current tasks
    tasks = service.list_tasks()
    display_tasks(tasks)

    if not tasks:
        return

    # Get task ID
    try:
        task_id = get_task_id()

        try:
            updated_task = service.mark_complete(task_id)
            status_str = Colors.GREEN + "Completed" + Colors.RESET if updated_task.completed else Colors.RED + "Pending" + Colors.RESET
            print(Colors.GREEN + f"\nTask status updated!" + Colors.RESET)
            print(f"  ID: {updated_task.id}")
            print(f"  Title: {updated_task.title}")
            print(f"  Status: {status_str}")
        except ValueError as e:
            print(Colors.RED + f"\nError: {e}" + Colors.RESET)

    except ValueError as e:
        print(Colors.RED + f"\nError: {e}" + Colors.RESET)


def main() -> None:
    """Main application loop with menu system."""
    # Initialize repository and service
    repository = TaskRepository()
    service = TaskService(repository)

    print(Colors.GREEN + "\n=== Todo Console Application (Phase I) ===" + Colors.RESET)
    print("Spec-Driven Development Demo\n")

    while True:
        try:
            display_menu()
            choice = get_user_choice()

            if choice == 1:
                add_task_handler(service)
            elif choice == 2:
                print("\n--- Task List ---")
                display_tasks(service.list_tasks())
            elif choice == 3:
                update_task_handler(service)
            elif choice == 4:
                delete_task_handler(service)
            elif choice == 5:
                toggle_complete_handler(service)
            elif choice == 6:
                print(Colors.GREEN + "\nThank you for using Todo App! Goodbye!" + Colors.RESET)
                break

            # Wait for user to read output before showing menu again
            input("\nPress Enter to continue...")

        except ValueError as e:
            print(Colors.RED + f"\nError: {e}" + Colors.RESET)
            input("\nPress Enter to try again...")
        except KeyboardInterrupt:
            print(Colors.YELLOW + "\n\nOperation cancelled by user." + Colors.RESET)
        except Exception as e:
            print(Colors.RED + f"\nUnexpected error: {e}" + Colors.RESET)
            input("\nPress Enter to continue...")


if __name__ == "__main__":
    main()
