<?php
require_once '../util/main.php';
require_once 'model/TasksDB.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function viewTask()
{
    try {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $task = $TasksDB->getTask($taskID);

        $SubtasksDB = new SubtasksDB();
        $subtasks = $SubtasksDB->getSubtasks($taskID);

        $response = ['success' => true, 'task' => $task, 'subtasks' => $subtasks];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}