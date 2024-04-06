<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function fetchCurrentBoardLists()
{
    $BoardsDB = new BoardsDB();
    $currentBoardID = $_SESSION['currentBoardID'];

    try {
        // Get the lists, tasks, and subtasks of the current board
        $currentBoardsLists = $BoardsDB->getBoardDetails($currentBoardID);

        // Response
        $response = ['success' => true, 'currentBoardLists' => $currentBoardsLists];
        echo json_encode($response);
        
    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}