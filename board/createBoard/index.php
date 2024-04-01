<?php
require_once '../../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';

session_start();

// Get action
$action = Action::getAction('showForm');

// Disable background scrolling
$_SESSION['overlay'] = true;

// Create form
$CreateBoardForm = new Form();
$formFields = array('title', 'description');
$CreateBoardForm->createForm($formFields);

// Validation for the form
$Validation = new Validate($CreateBoardForm);

// Starting Lists
if (!isset($_SESSION['startingLists'])) {
    $_SESSION['startingLists'] = ['todo', 'doing', 'done'];
}

// Controller
switch ($action) {
    case ('showForm'):
        $title = filter_input(INPUT_POST, 'title') ?? '';
        $description = filter_input(INPUT_POST, 'description') ?? '';
        break;
}

//include 'board/mainBoard.php';
//include 'createBoard.php';
?>