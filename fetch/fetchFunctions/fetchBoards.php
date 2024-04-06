<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function fetchBoards()
{
    $BoardsDB = new BoardsDB();
    $userID = $_SESSION['userID'];

    try {
        // Get user boards
        $boards = $BoardsDB->getBoards($userID);

        // Set current board ID to the first user board (if not set yet)
        if (!isset($_SESSION['currentBoardID'])) {
            $firstBoard = $boards[0];
            $_SESSION['currentBoardID'] = $firstBoard->getBoardID();
        }

        // Get current board ID
        $currentBoardID = $_SESSION['currentBoardID'];

        // Get title of the current board
        $boardTitle = $BoardsDB->getBoardTitle($currentBoardID);

        // Response
        $response = ['success' => true, 'currentBoardID' => $currentBoardID, 'boardTitle' =>
            $boardTitle, 'boards' => $boards];
        echo json_encode($response);
        
    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}