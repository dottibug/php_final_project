<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'fetch/fetchFunctions/ListFunctions.php';
require_once 'model/Form.php';

require_once 'fetch/fetchFunctions/boardFunctions.php';
require_once 'fetch/fetchFunctions/taskFunctions.php';
require_once 'fetch/fetchFunctions/subtaskFunctions.php';
require_once 'fetch/fetchFunctions/logout.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

// Action
$action = Action::getAction('fetchBoards');

// Instantiate classes
$listFunctions = new ListFunctions();
$boardFunctions = new BoardFunctions();
$taskFunctions = new TaskFunctions();
$subtaskFunctions = new SubtaskFunctions();

// FIXME : something wrong going on when deleting lists from board

// Controller
switch ($action) {
    // Boards
    case ('fetchBoards'):
        $boardFunctions->fetchBoards();
        break;
    case ('fetchCurrentBoardLists'):
        $boardFunctions->fetchCurrentBoardLists();
        break;
    case('updateCurrentBoardID');
        $boardFunctions->updateCurrentBoardID();
        break;
    case ('showCreateBoardForm'):
        $boardFunctions->showCreateBoardForm();
        break;
    case ('editBoardForm'):
        $boardFunctions->showEditBoardForm();
        break;
    case ('editBoard'):
        $boardFunctions->editBoard();
        break;
    case('deleteBoardWarning'):
        $boardFunctions->showDeleteBoardWarning();
        break;
    case ('deleteBoard'):
        $boardFunctions->deleteBoard();
        break;
    case ('addBoard'):
        $boardFunctions->addBoard();
        break;

    // List
    case ('addList'):
        $form = new Form();
        $listFunctions->setForm($form);
        $listFunctions->addList();
        break;
    case ('deleteList'):
        $form = new Form();
        $listFunctions->setForm($form);
        $listFunctions->deleteList();
        break;
    case('newest'):
    case('oldest'):
        $listFunctions->sortTasks();
        break;

    // Tasks
    case ('viewTask'):
        $taskFunctions->viewTask();
        break;
    case ('showAddTaskForm'):
        $taskFunctions->showAddTaskForm();
        break;
    case ('addTask'):
        $taskFunctions->addTask();
        break;
    case('editTaskForm'):
        $taskFunctions->showEditTaskForm();
        break;
    case ('editTask'):
        $taskFunctions->editTask();
        break;
    case ('deleteTaskWarning'):
        $taskFunctions->showDeleteTaskWarning();
        break;
    case('deleteTask'):
        $taskFunctions->deleteTask();
        break;

    // Subtasks
    case('updateSubtaskStatus'):
        $subtaskFunctions->updateSubtaskStatus();
        break;
    case ('addSubtask'):
        $subtaskFunctions->addSubtask();
        break;
    case('deleteSubtask'):
        $subtaskFunctions->deleteSubtask();
        break;

    // Logout
    case('logout'):
        logout();
        break;
}




