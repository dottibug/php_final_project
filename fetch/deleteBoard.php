<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/BoardsDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

// Instantiate classes
$BoardsDB = new BoardsDB();

// Get action
$action = Action::getAction('confirmDelete');

// Current board
$currentBoard = $_SESSION['currentBoardID'];

// Controller
switch ($action) {
    case ('confirmDelete'):
        // Get the board title
        $boardTitle = $BoardsDB->getBoardTitle($currentBoard);

        // Response
        $response = ['success' => true, 'boardTitle' => $boardTitle];
        echo json_encode($response);
        break;
    case ('deleteBoard'):
        try {
            // Delete current board
            $BoardsDB->deleteBoard($currentBoard);

            // Unset currentBoardID
            unset($_SESSION['currentBoardID']);

            // Response
            $response = ['success' => true];
            echo json_encode($response);
        } catch (Exception $e) {
            $response = ['success' => false];
            echo json_encode($response);
        }
        break;
}
