<?php
session_start();

header('Content-Type: application/json');

require_once '../util/main.php';
require_once 'model/BoardsDB.php';

// Initialize classes
$BoardsDB = new BoardsDB();

// Get the lists, tasks, and subtask counts of currentBoardID
$currentBoardID = $_SESSION['currentBoardID'];
$currentBoardsLists = $BoardsDB->getBoardDetails($currentBoardID);

// Response
$response = ['success' => true, 'currentBoardLists' => $currentBoardsLists];
echo json_encode($response);