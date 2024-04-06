<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function addSubtask()
{
    try {
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

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}