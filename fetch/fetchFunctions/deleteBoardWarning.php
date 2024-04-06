<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function deleteBoardWarning()
{
    try {
        // Get board title
        $BoardsDB = new BoardsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $boardTitle = $BoardsDB->getBoardTitle($currentBoardID);

        $response = ['success' => true, 'boardTitle' => $boardTitle];
        echo json_encode($response);
        
    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}