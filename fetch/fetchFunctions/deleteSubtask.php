<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function deleteSubtask()
{
    try {
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

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}