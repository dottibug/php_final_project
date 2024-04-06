<?php
require_once '../util/main.php';
require_once 'model/TasksDB.php';


header('Content-Type: application/x-www-form-urlencoded');
function deleteTaskWarning()
{
    try {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $task = $TasksDB->getTask($taskID);

        $response = ['success' => true, 'task' => $task];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}