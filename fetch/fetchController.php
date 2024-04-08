<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'fetch/fetchFunctions/fetchBoards.php';
require_once 'fetch/fetchFunctions/fetchCurrentBoardLists.php';
require_once 'fetch/fetchFunctions/updateCurrentBoardID.php';
require_once 'fetch/fetchFunctions/addTaskForm.php';
require_once 'fetch/fetchFunctions/deleteSubtask.php';
require_once 'fetch/fetchFunctions/addSubtask.php';
require_once 'fetch/fetchFunctions/addTask.php';
require_once 'fetch/fetchFunctions/newBoardForm.php';
require_once 'fetch/fetchFunctions/deleteList.php';
require_once 'fetch/fetchFunctions/addList.php';
require_once 'fetch/fetchFunctions/addBoard.php';
require_once 'fetch/fetchFunctions/editBoardForm.php';
require_once 'fetch/fetchFunctions/editBoard.php';
require_once 'fetch/fetchFunctions/deleteBoardWarning.php';
require_once 'fetch/fetchFunctions/deleteBoard.php';
require_once 'fetch/fetchFunctions/updateSubtaskStatus.php';
require_once 'fetch/fetchFunctions/editTaskForm.php';
require_once 'fetch/fetchFunctions/editTask.php';
require_once 'fetch/fetchFunctions/viewTask.php';
require_once 'fetch/fetchFunctions/deleteTaskWarning.php';
require_once 'fetch/fetchFunctions/deleteTask.php';
require_once 'fetch/fetchFunctions/logout.php';
require_once 'fetch/fetchFunctions/sortTasks.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

// Action
$action = Action::getAction('fetchBoards');

// Controller
switch ($action) {
    case ('fetchBoards'):
        fetchBoards();
        break;
    case ('fetchCurrentBoardLists'):
        fetchCurrentBoardLists();
        break;
    case('updateCurrentBoardID');
        updateCurrentBoardID();
        break;
    case ('showNewBoardForm'):
        newBoardForm();
        break;
    case ('editBoard'):
        editBoard();
        break;
    case('deleteBoardWarning'):
        deleteBoardWarning();
        break;
    case ('deleteBoard'):
        deleteBoard();
        break;
    case ('addList'):
        addList();
        break;
    case ('deleteList'):
        deleteList();
        break;
    case ('addBoard'):
        addBoard();
        break;
    case ('editBoardForm'):
        editBoardForm();
        break;
    case ('showAddTaskForm'):
        showAddTaskForm();
        break;
    case ('addSubtask'):
        addSubtask();
        break;
    case('updateSubtaskStatus'):
        updateSubtaskStatus();
        break;
    case('deleteSubtask'):
        deleteSubtask();
        break;
    case ('viewTask'):
        viewTask();
        break;
    case ('addTask'):
        addTask();
        break;
    case ('editTask'):
        editTask();
        break;
    case('editTaskForm'):
        editTaskForm();
        break;
    case ('deleteTaskWarning'):
        deleteTaskWarning();
        break;
    case('deleteTask'):
        deleteTask();
        break;
    case('logout'):
        logout();
        break;
    case('newest'):
    case('oldest'):
        sortTasks();
        break;
}




