<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';
function deleteBoard()
{
    try {
        // Delete board
        $BoardsDB = new BoardsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $BoardsDB->deleteBoard($currentBoardID);

        // Unset currentBoardID in session
        unset($_SESSION['currentBoardID']);

        // Response
        $response = ['success' => true];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false];
        echo json_encode($response);
    }
}