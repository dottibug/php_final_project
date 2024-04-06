<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/SubtasksDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

$action = Action::getAction('updateStatus');

// Instantiate classes
$SubtasksDB = new SubtasksDB();

// Controller
switch ($action) {
    case ('updateStatus'):
        try {
            // Update the status of the subtask
            $subtaskID = filter_input(INPUT_POST, 'subtaskID');
            $newStatus = filter_input(INPUT_POST, 'newStatus');
            $SubtasksDB->updateStatus($newStatus, $subtaskID);

            // Re-fetch all the subtasks for this task
            $taskID = filter_input(INPUT_POST, 'taskID');
            $subtasks = $SubtasksDB->getSubtasks($taskID);

            // Response
            $response = ['success' => true, 'message' => "Subtask $subtaskID was updated.", 'subtasks' => $subtasks, 'taskID' => $taskID];
            echo json_encode($response);
        } catch (Exception $e) {
            $response = ['success' => false, 'message' => $e->getMessage()];
            echo json_encode($response);
        }
        break;
}
