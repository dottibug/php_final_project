## Description

A kanban application that allows a user to create, edit, and delete lists of tasks and subtasks.
The lists are grouped into relevant boards, which the user can also create, edit, and delete.

## Installation

### Prerequisites

- PHP >= 8.0
- MySQL >= 5.7
- Server environment (XAMPP)

### Setup

1. Extract the compressed file in your local server's root directory.
2. Launch Apache and MySQL.
3. Create a new database from the kanban.sql file.
4. The user credentials for the database are 'kanban_user@localhost' with the password 'sesame'

## Usage

1. Navigate to http://localhost/kanban in your web browser.
2. Login using the following credentials: Username: 'kanbanUser', Password: 'sesame'

## Testing

1. Select various boards in the sidebar navigation menu to see each board's related lists and
   tasks. These are dynamically rendered via fetch requests to PHP endpoints.
2. Test creating a new board. Click 'Create New Board' in the sidebar menu. Enter "My New Board"
   for the title. The default lists ("todo", "doing", and "done") can be modified, deleted, or
   added to by clicking "Add New List". Note that the title and list inputs cannot be blank (error
   messages will be shown in the UI if you try to create a new board without these values). You
   can, however, create a new board with no lists at all. Delete the default lists of "todo",
   "doing", and "done". Click "Create Board". The new board should show up in the sidebar menu, and
   should be the active board (highlighted in dark purple).
3. Recall that we deleted our default starting lists in the previous steps when creating the new
   board. On your new board, click "Add New List". In the popup form, click "Add New List" to
   begin adding lists to your new board. Make 3 lists named "List 1", "List 2", and "List 3".
   Click "Save Changes" to see these lists populate your board.
4. Our new lists don't have tasks yet. Under "List 1", click "Add First Task". Give it a title
   of "Task 1". You can enter a description or leave it blank. The dropdown menu lets you select
   which list the task should be added to. Let's keep it in "List 1" for now. Subtasks can be
   dynamically added or deleted to our new task, too. Let's create one called "The first
   subtask" and a second called "The second subtask". Click "Create Task" to see the task added
   to "List 1".
5. Add 2 more tasks to "List 1", calling them "Task 2" and "Task 3", respectively. You can
   choose to add or delete the subtasks for these tasks.
6. Now that there is more than one task in "List 1", you can sort them by newest or oldest. By
   default, the tasks are sorted by oldest. Click the arrow next to the title of "List 1" and
   select "Sort by newest" in the dropdown menu. Your tasks should now be sorted in the
   following order: Task 3, Task 2, Task 1. The sort order of each list is preserved in session
   data. For example, if you refresh the page, the tasks in "List 1" will still be sorted by
   newest.
7. Let's move a task from one list to another. Click the horizontal menu button in the corner of
   "Task 3" and select "Edit Task". Use the "Move To List" dropdown menu to select "List 2".
   Click "Save Changes". You should see that "Task 3" was moved to "List 2".
8. Let's delete "List 3". Click the vertical menu button in the top right corner (beside the
   "Add New Task" button). Select "Edit Board". In the popup, click the "x" next to "List 3".
   Click "Save Changes" to see that "List 3" was deleted from the board.
9. Tasks can also be deleted. Under "List 1", click the horizontal menu button in top right
   corner of "Task 2". Click "Delete Task". Check that the warning message indicates you are
   deleting "Task 2". Click "Delete". You should see that "Task 2" was deleted from "List 1",
   and we can no longer sort that list either, as there is only one task in the list.
10. Subtasks can be checked or unchecked, so you can track the progress of completing tasks.
    Click anywhere in the box of "Task 1" (except for the horizontal menu button). This shows
    your task details and its related subtasks. Check off "The first subtask" to see the
    progress update from "0 of 2" to "1 of 2". Click "x" to close the popup and ensure that the
    progress "1 of 2" was updated under "Task 1".
11. We can also delete boards. Let's delete the board (and its relevant lists, tasks, and
    subtasks) that we just created. In the top right corner, click the vertical menu button and
    select "Delete Board". Check that the warning message specifies "My New Board" for deletion.
    Click "Delete". The board will be deleted and the first board ("Blog Website") will become
    the active board.
12. Continue testing the features. Try to create boards, lists, and tasks with empty input to
    see error messages. Check that the count for boards updates when creating and deleting
    boards (this count is seen in the sidebar menu within the parentheses beside "All Boards").
    Likewise, check that the number of tasks in a list is correctly displayed beside each list
    title. Try adding tasks by clicking the "Add New Task" in the top right corner. This will
    add a new task to the active board's first list by default (though you can select a
    different list, as well). Note that clicking the "Add New Task" button below a specific list
    will select that list by default in the "Add To List" dropdown.
13. After testing, click "Logout" to end your session. This should redirect to
    http://localhost/kanban/login. In your browser's address bar, try to go to
    http://localhost/kanban/board. This is a protected page and should redirect you to the login
    page if you are logged out.

## Credits

- Tanya Woodside
        