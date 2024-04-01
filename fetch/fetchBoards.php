<?php
session_start();
header('Content-Type: application/json');

// Required files
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

// Initialize classes
$BoardsDB = new BoardsDB();

// Set up user boards
$userID = $_SESSION['userID'];
$boards = $BoardsDB->getBoards($userID);

// Set currentBoardID session
$firstBoard = $boards[0];

if (!isset($_SESSION['currentBoardID'])) {
    $_SESSION['currentBoardID'] = $firstBoard->getBoardID();
}

$currentBoardID = $_SESSION['currentBoardID'];

// Change board title
$boardTitle = $BoardsDB->getBoardTitle($currentBoardID);

// Response
$response = ['success' => true, 'currentBoardID' => $currentBoardID, 'boards' => $boards, 'boardTitle' => $boardTitle];
echo json_encode($response);