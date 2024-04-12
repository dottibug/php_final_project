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
$subtaskFunctions = new SubtaskFunctions();
$taskFunctions = new TaskFunctions();

$boardFunctions = new BoardFunctions();

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
        $form = new Form();
        $boardFunctions->setForm($form);
        $boardFunctions->showCreateBoardForm($form);
        break;
    case ('editBoardForm'):
        $form = new Form();
        $boardFunctions->setForm($form);
        $boardFunctions->showEditBoardForm($form);
        break;
    case ('editBoard'):
        $form = new Form();
        $boardFunctions->setForm($form);
        $boardFunctions->editBoard($form);
        break;
    case('deleteBoardWarning'):
        $boardFunctions->showDeleteBoardWarning();
        break;
    case ('deleteBoard'):
        $boardFunctions->deleteBoard();
        break;
    case ('addBoard'):
        $form = new Form();
        $boardFunctions->setForm($form);
        $boardFunctions->addBoard($form);
        break;

    // List
    case ('addList'):
        $form = new Form();
        $listFunctions->setForm($form);
        $listFunctions->addList($form);
        break;
    case ('deleteList'):
        $form = new Form();
        $listFunctions->setForm($form);
        $listFunctions->deleteList($form);
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
        $form = new Form();
        $taskFunctions->setForm($form);
        $taskFunctions->showAddTaskForm($form);
        break;
    case ('addTask'):
        $form = new Form();
        $taskFunctions->setForm($form);
        $taskFunctions->addTask($form);
        break;
    case('editTaskForm'):
        $form = new Form();
        $taskFunctions->setForm($form);
        $taskFunctions->showEditTaskForm($form);
        break;
    case ('editTask'):
        $form = new Form();
        $taskFunctions->setForm($form);
        $taskFunctions->editTask($form);
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
        $form = new Form();
        $subtaskFunctions->setForm($form);
        $subtaskFunctions->addSubtask($form);
        break;
    case('deleteSubtask'):
        $form = new Form();
        $subtaskFunctions->setForm($form);
        $subtaskFunctions->deleteSubtask($form);
        break;

    // Logout
    case('logout'):
        logout();
        break;
}




