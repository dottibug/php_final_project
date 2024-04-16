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

1. **Board Navigation and Interaction**: Explore the sidebar to switch between boards. Each board's
   lists and tasks should dynamically update.

2. **Creating and Editing Boards**: Test creating a new board with the 'Create New Board' option.
   Try adding, modifying, and deleting lists within boards. Note that boards can be created
   with or without default lists.

3. **Managing Lists and Tasks**: Within any board, add new lists and tasks. Test editing and
   deleting tasks and lists, including sorting tasks and moving them between lists.

4. **Subtasks and Task Progress**: For any task, add subtasks and mark them as complete to track
   progress. Check that the task progress updates correctly.

5. **Deleting Boards, Lists, and Tasks**: Test deleting boards, lists, and tasks. Check that the
   deleted elements are removed correctly.

6. **Session Persistence**: Check that the application preserves the sort order of tasks after a
   page refresh.

7. **Authorization and Access Control**: Try to access http://localhost/board (which is a protected
   page) without being logged in. This should cause redirection to the login page. Check that
   logging out works.

8. **Error Handling**: Try creating boards, lists, and tasks with empty inputs to trigger error
   messages.

## Credits

- Tanya Woodside
        