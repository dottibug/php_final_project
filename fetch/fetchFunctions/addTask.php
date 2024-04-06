<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';
require_once 'model/TasksDB.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function addTask()
{
    try {
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');
        $listID = filter_input(INPUT_POST, 'listID');

        // Create form
        $Form = new Form();
        $formFields = ['title', 'description'];
        $Form->addFields($formFields);
        $Form->getField('title')->setValue($title);
        $Form->getField('description')->setValue($description);
        $Form->getField('title')->setType('text');
        $Form->getField('description')->setType('textarea');

        // Validation
        $Validate = new Validate($Form);
        $Validate->text('title', $title, true, 1, 24);
        $Validate->text('description', $description, false, 1, 2000);

        // Fields array
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Lists for dropdown menu
        $TaskListsDB = new TaskListsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        // Subtasks
        $subtasks = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'description' && $key != 'action' && $key != 'listID') {
                // User input
                $value_f = filter_input(INPUT_POST, $key);

                // Add to Form
                $Form->addField($key);
                $Form->getField($key)->setValue($value_f);

                // Validate
                $Validate->text($key, $value_f, true, 1, 300);

                // Set a custom error message
                if ($Form->getField($key)->hasError()) {
                    $Form->getField($key)->setError('Subtasks must be 1 to 300 characters long.');
                }

                $subtasks[] = $Form->getField($key);
            }
        }

        // Response
        if ($Form->hasErrors()) {
            $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields, 'lists' => $lists, 'subtasks' => $subtasks];
            echo json_encode($response);
        } else {
            // Add new task
            $TasksDB = new TasksDB();
            $TasksDB->addTask($currentBoardID, $listID, $title, $description);

            // New task's ID
            $taskID = $TasksDB->getTaskID($title, $listID);

            // Add subtasks
            $SubtasksDB = new SubtasksDB();
            foreach ($subtasks as $subtask) {
                $subtaskValue = $subtask->getValue();
                $SubtasksDB->addSubtask($taskID, $subtaskValue, 'unchecked');
            }

            $response = ['success' => true, 'fields' => $fields, 'lists' => $lists,
                'subtasks' => $subtasks];

            echo json_encode($response);
        }

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}