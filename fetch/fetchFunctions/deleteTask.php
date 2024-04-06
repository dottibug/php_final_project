<?php
require_once '../util/main.php';
require_once 'model/TasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function deleteTask()
{
    try {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $TasksDB->deleteTask($taskID);

        $response = ['success' => true];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}