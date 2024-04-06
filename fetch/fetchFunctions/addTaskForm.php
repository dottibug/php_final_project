<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function showAddTaskForm()
{
    try {
        // Create form
        $Form = new Form();

        // Form fields
        $formFields = ['title', 'description', 'list'];
        $Form->addFields($formFields);
        $Form->getField('title')->setType('text');
        $Form->getField('description')->setType('textarea');

        // Fields array for response
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Board lists array for response
        $TaskListsDB = new TaskListsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        // Create two empty subtask fields
        $defaultSubtasks = ['subtask1', 'subtask2'];
        $Form->addFields($defaultSubtasks);
        $_SESSION['subtasksToDelete'] = [];
        $subtasks = [];
        foreach ($defaultSubtasks as $subtask) {
            $Form->getField($subtask)->setType('text');
            $subtasks[] = $Form->getField($subtask);
        }

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists, 'subtasks' =>
            $subtasks];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}