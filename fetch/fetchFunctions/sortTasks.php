<?php
require_once '../util/main.php';

header('Content-Type: application/x-www-form-urlencoded');

function sortTasks()
{
    try {
        $sortBy = filter_input(INPUT_POST, 'action');
        $listID = filter_input(INPUT_POST, 'listID');
        $_SESSION['sortOrder'][$listID] = $sortBy;

        $response = ['success' => true];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }

}