<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function updateCurrentBoardID()
{
    if (isset($_POST['newBoardID'])) {
        $newBoardID = filter_input(INPUT_POST, 'newBoardID');
        $_SESSION['currentBoardID'] = $newBoardID;

        $response = ['success' => true, 'newCurrentBoardID' => $newBoardID];
        echo json_encode($response);

    } else {
        $response = ['success' => false, 'message' => 'The current board ID was not changed.'];
        echo json_encode($response);
    }
}
