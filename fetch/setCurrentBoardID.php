<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

if (isset($_POST['currentBoardID'])) {
    $newBoardID = filter_input(INPUT_POST, 'currentBoardID');
    $_SESSION['currentBoardID'] = $newBoardID;
    echo json_encode(['success' => true, 'message' => "The currentBoardID was reset to $newBoardID"]);
} else {
    echo json_encode(['success' => false, 'message' => 'The currentBoardID was not reset.']);
}