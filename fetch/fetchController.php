<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'fetch/fetchFunctions/BoardFunctions.php';
require_once 'fetch/fetchFunctions/ListFunctions.php';
require_once 'fetch/fetchFunctions/TaskFunctions.php';
require_once 'fetch/fetchFunctions/SubtaskFunctions.php';
require_once 'fetch/fetchFunctions/logout.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

// Action
$action = Action::getAction('fetchBoards');

$BoardFunctions = new BoardFunctions();
$ListFunctions = new ListFunctions();
$TaskFunctions = new TaskFunctions();
$SubtaskFunctions = new SubtaskFunctions();

// Controller
switch ($action) {
    // Boards
    case ('fetchBoards'):
        $BoardFunctions->fetchBoards();
        break;
    case ('fetchCurrentBoardLists'):
        $BoardFunctions->fetchCurrentBoardLists();
        break;
    case('updateCurrentBoardID');
        $BoardFunctions->updateCurrentBoardID();
        break;
    case ('showCreateBoardForm'):
        $BoardFunctions->showCreateBoardForm();
        break;
    case ('editBoardForm'):
        $BoardFunctions->showEditBoardForm();
        break;
    case ('editBoard'):
        $BoardFunctions->editBoard();
        break;
    case('deleteBoardWarning'):
        $BoardFunctions->showDeleteBoardWarning();
        break;
    case ('deleteBoard'):
        $BoardFunctions->deleteBoard();
        break;
    case ('addBoard'):
        $BoardFunctions->addBoard();
        break;

    // List
    case ('addList'):
        $ListFunctions->addList();
        break;
    case ('deleteList'):
        $ListFunctions->deleteList();
        break;
    case('newest'):
    case('oldest'):
        $ListFunctions->sortTasks();
        break;

    // Tasks
    case ('viewTask'):
        $TaskFunctions->viewTask();
        break;
    case ('showAddTaskForm'):
        $TaskFunctions->showAddTaskForm();
        break;
    case ('addTask'):
        $TaskFunctions->addTask();
        break;
    case('editTaskForm'):
        $TaskFunctions->showEditTaskForm();
        break;
    case ('editTask'):
        $TaskFunctions->editTask();
        break;
    case ('deleteTaskWarning'):
        $TaskFunctions->showDeleteTaskWarning();
        break;
    case('deleteTask'):
        $TaskFunctions->deleteTask();
        break;

    // Subtasks
    case('updateSubtaskStatus'):
        $SubtaskFunctions->updateSubtaskStatus();
        break;
    case ('addSubtask'):
        $SubtaskFunctions->addSubtask();
        break;
    case('deleteSubtask'):
        $SubtaskFunctions->deleteSubtask();
        break;

    // Logout
    case('logout'):
        logout();
        break;
}




