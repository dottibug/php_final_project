<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';
require_once 'model/TasksDB.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function editTask()
{
    try {
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');
        $listID = filter_input(INPUT_POST, 'listID');
        $taskID = filter_input(INPUT_POST, 'taskID');

        // Create form
        $Form = new Form();
        $Form->addField('title');
        $Form->getField('title')->setValue($title);
        $Form->getField('title')->setType('text');
        $Form->addField('description');
        $Form->getField('description')->setValue($description);
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
            if ($key != 'title' && $key != 'description' && $key != 'action' && $key != 'listID'
                && $key != 'taskID') {
                // User input
//                $value_f = filter_input(INPUT_POST, $key);

                // Add to Form
                $Form->addField($key);
                $Form->getField($key)->setValue($value);

                // Validate
                $Validate->text($key, $value, true, 1, 300);

                // Set a custom error message
                if ($Form->getField($key)->hasError()) {
                    $Form->getField($key)->setError('Subtasks must be 1 to 300 characters long.');
                }
                $subtasks[] = $Form->getField($key);
            }
        }

        // Responses
        if ($Form->hasErrors()) {
            $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields, 'lists' => $lists, 'subtasks' => $subtasks];
            echo json_encode($response);
        } else {
            // Update the task title and description
            $TasksDB = new TasksDB();
            $TasksDB->updateTaskTitle($taskID, $title);
            $TasksDB->updateTaskDescription($taskID, $description);

            // Delete subtasksToDelete from the database
            $SubtasksDB = new SubtasksDB();
            $subtasksToDelete = $_SESSION['subtasksToDelete'];
            foreach ($subtasksToDelete as $subtask) {
                $SubtasksDB->deleteSubtask($subtask);
            }

            // Update or add the remaining board lists
            foreach ($subtasks as $subtask) {
                $subtaskID = $subtask->getName();
                $subtaskExists = $SubtasksDB->subtaskExists($subtaskID);

                if ($subtaskExists) {
                    // Update subtask if it exists
                    $subtaskValue = $subtask->getValue();
                    $SubtasksDB->updateSubtaskDescription($subtaskID, $subtaskValue);
                } else {
                    // Add subtask if it doesn't exist yet
                    $subtaskValue = $subtask->getValue();
                    $SubtasksDB->addSubtask($taskID, $subtaskValue, 'unchecked');
                }
            }

            // Response
            $response = ['success' => true];
            echo json_encode($response);
        }


    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}