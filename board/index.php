<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/BoardsDB.php';
require_once 'model/TasksDB.php';
require_once 'model/TaskListsDB.php';
require_once 'model/SubtasksDB.php';

session_start();

// Only allow valid users access to this page
if (!$_SESSION['validUser']) {
    header('Location: ../index.php?action=show_login');
}

// Initialize classes
$BoardsDB = new BoardsDB();
$TaskListsDB = new TaskListsDB();
$TasksDB = new TasksDB();
$SubtasksDB = new SubtasksDB();

const SHOW_BOARD = 'showBoard';
const ADD_BOARD_FORM = 'addBoardForm';
const ADD_BOARD = 'addBoard';
const DELETE_STARTING_LIST = 'deleteStartingList';

// Get action. Default is 'show_board'
$action = Action::getAction(SHOW_BOARD);

// Setup user's boards
$userID = $_SESSION['userID'];
//$currentBoardID = $_SESSION['currentBoardID'];

////// Create AddBoardForm
//$AddBoardForm = new Form();
//$addBoardFields = array('title', 'description');
//$AddBoardForm->createForm($addBoardFields);
////
////// Create Validation object for AddBoardForm
//$ValidateAddBoard = new Validate($AddBoardForm);

// Controller
switch ($action) {
    case (SHOW_BOARD):
        $_SESSION['overlay'] = false;
        break;

    case (ADD_BOARD_FORM):
        // Overlay cookie disables scrolling of body in the background
        $_SESSION['overlay'] = true;

        // Define formType to display
        $formType = 'add';

        //// Create AddBoardForm
        $AddBoardForm = new Form();
        $addBoardFields = array('title', 'description');
        $AddBoardForm->createForm($addBoardFields);


//
//// Create Validation object for AddBoardForm
//        $ValidateAddBoard = new Validate($AddBoardForm);

        // Get starting lists
//        $_SESSION['startingLists'] = $_SESSION['startingLists'] ?? $defaultStartingLists;

        // Get form values
        $title = filter_input(INPUT_POST, 'title') ?? '';
        $description = filter_input(INPUT_POST, 'description') ?? '';
//        $editStartingLists = filter_input(INPUT_POST, 'editStartingLists') ?? false;

        if (!isset($_SESSION['startingLists'])) {
            $defaultStartingLists = ['todo', 'doing', 'done'];
            $_SESSION['startingLists'] = $defaultStartingLists;
        }

//        if (!$editStartingLists) {
        // Initial starting lists for every new list
//            $startingLists = $defaultStartingLists;

        // Create AddBoardForm
//            $AddBoardForm->addDynamicFields($startingLists);
//        } else {
        // Get the starting list to be deleted
//            $listToDelete = filter_input(INPUT_POST, 'listToDelete');

        // Delete the list from the AddBoardForm
//            $AddBoardForm->deleteField($listToDelete);

        // Update the startingLists array
//            $keyToDelete = array_search($listToDelete, $startingLists);
//            unset($startingLists[$keyToDelete]);

        // Re-create AddBoardForm
//        $AddBoardForm->addDynamicFields($startingLists);
//
        // Reset values
//            $listToDelete = '';
//        }
        include 'addEditBoard.php';
        break;
    case (ADD_BOARD):
        // Get the new board data from the form
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');

        // Validate the new board data (must include title)
        $ValidateAddBoard->text('title', $title, true, 1, 24);
        $ValidateAddBoard->text('description', $description, false, 1, 300);

        // Check if form has errors
        if ($AddBoardForm->hasErrors()) {
            $formType = 'add';
            include 'addEditBoard.php';
        } else {
            // Add new board to database
            $userID = $_SESSION['userID'];
            $BoardsDB->addBoard($userID, $title, $description);
            // Show board
            header("Location: .?action=showBoard");
            exit;
        }

        break;
    case (DELETE_STARTING_LIST):
        // Get form values
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');

        // Get the starting list to be deleted
        $listToDelete = filter_input(INPUT_POST, 'listToDelete');

        // Delete the list from the AddBoardForm
        $AddBoardForm->deleteField($listToDelete);

        // Update the startingLists array
        $keyToDelete = array_search($listToDelete, $startingLists);
        unset($startingLists[$keyToDelete]);

        $AddBoardForm->addDynamicFields($startingLists);

        // Display AddBoardForm
//        header("Location: .?action=addBoardForm");
        $formType = 'add';
        include 'addEditBoard.php';
        break;
}
//include 'view/header.php';
include 'mainBoard.php';
?>

