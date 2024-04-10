<?php

require_once '../util/main.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

class SubtaskFunctions
{
    // Update subtask status (checked or unchecked)
    // ------------------------------------------------------------------------------
    public function updateSubtaskStatus()
    {
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
    }

    // Add subtask
    // ------------------------------------------------------------------------------
    public function addSubtask()
    {
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');

        // Create form
        $Form = new Form();
        $formFields = ['title', 'description'];
        $Form->addFields($formFields);
        $Form->getField('title')->setValue($title);
        $Form->getField('description')->setValue($description);

        // Fields array
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Lists for dropdown menu
        $TaskListsDB = new TaskListsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        // Subtasks array
        $subtasks = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'description' && $key != 'action') {
                $Form->addField($key);
                $Form->getField($key)->setValue($value);
                $subtasks[] = $Form->getField($key);
            }
        }

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists,
            'subtasks' => $subtasks];

        echo json_encode($response);
    }

    // Delete subtask
    // ------------------------------------------------------------------------------
    public function deleteSubtask()
    {
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');
        $itemToDelete = filter_input(INPUT_POST, 'itemToDelete');

        $_SESSION['subtasksToDelete'][] = $itemToDelete;

        // Create form
        $Form = new Form();
        $formFields = ['title', 'description'];
        $Form->addFields($formFields);
        $Form->getField('title')->setValue($title);
        $Form->getField('description')->setValue($description);

        // Fields array
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Lists for dropdown menu
        $TaskListsDB = new TaskListsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        // Subtasks array
        $subtasks = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'description' && $key != 'action'
                && $key != 'itemToDelete' && $key != $itemToDelete) {
                $Form->addField($key);
                $Form->getField($key)->setValue($value);
                $subtasks[] = $Form->getField($key);
            }
        }

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists, 'subtasks' =>
            array_values($subtasks)];

        echo json_encode($response);
    }
}