<?php
require_once '../util/main.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function updateSubtaskStatus()
{
    try {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $subtaskID = filter_input(INPUT_POST, 'subtaskID');
        $newStatus = filter_input(INPUT_POST, 'newStatus');

        // Update subtask status
        $SubtasksDB = new SubtasksDB();
        $SubtasksDB->updateStatus($newStatus, $subtaskID);

        // Re-fetch subtasks for the task
        $subtasks = $SubtasksDB->getSubtasks($taskID);

        // Response
        $response = ['success' => true, 'message' => "Subtask $subtaskID was updated.", 'subtasks' => $subtasks, 'taskID' => $taskID];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}