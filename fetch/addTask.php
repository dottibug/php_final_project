<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';
require_once 'model/BoardsDB.php';
require_once 'model/TasksDB.php';
require_once 'model/SubtasksDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

$action = Action::getAction('showAddTaskForm');

// Instantiate classes
$TaskListsDB = new TaskListsDB();
$BoardsDB = new BoardsDB();

// Create form
$Form = new Form();

// Add form fields
$formFields = ['title', 'description', 'list'];
$Form->addFields($formFields);

// Get current board id
$currentBoardID = $_SESSION['currentBoardID'];

// Controller
switch ($action) {
    case ('showAddTaskForm'):
        try {
            $fields = [$Form->getField('title'), $Form->getField('description')];
            // Get board lists to display in dropdown menu
            $lists = $TaskListsDB->getAllLists($currentBoardID);

            // Create subtasks default
            $defaultSubtasks = ['subtask1', 'subtask2'];
            $Form->addFields($defaultSubtasks);
            $subtasks = [];
            foreach ($defaultSubtasks as $subtask) {
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
        break;
    case ('deleteSubtask'):
        try {
            $title = filter_input(INPUT_POST, 'title');
            $description = filter_input(INPUT_POST, 'description');
            $listID = filter_input(INPUT_POST, 'subtaskListID');
            $subtaskToDelete = filter_input(INPUT_POST, 'subtaskToDelete');

            // Update Form title and description
            $Form->getField('title')->setValue($title);
            $Form->getField('description')->setValue($description);

            // Set fields array for response
            $fields = [$Form->getField('title'), $Form->getField('description')];

            // Get board lists to display in dropdown menu
            $lists = $TaskListsDB->getAllLists($currentBoardID);

            // Create subtasks array for response
            $subtasks = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'description' && $key != 'action' && $key != 'subtaskListID' && $key != 'subtaskToDelete') {
                    if ($key != $subtaskToDelete) {
                        // Add the subtask as field to Form
                        $Form->addField($key);
                        $Form->getField($key)->setValue($value);
                        $subtasks[] = $Form->getField($key);
                    }
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
        break;
    case ('addSubtask'):
        try {
            $title = filter_input(INPUT_POST, 'title');
            $description = filter_input(INPUT_POST, 'description');
            $listID = filter_input(INPUT_POST, 'subtaskListID');

            // Update Form title and description
            $Form->getField('title')->setValue($title);
            $Form->getField('description')->setValue($description);

            // Set fields array for response
            $fields = [$Form->getField('title'), $Form->getField('description')];

            // Get board lists to display in dropdown menu
            $lists = $TaskListsDB->getAllLists($currentBoardID);

            // Create subtasks array for response
            $subtasks = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'description' && $key != 'action' && $key != 'subtaskListID') {
                    // Add the subtask as field to Form
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
        break;
    case('addTask'):
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');
        $listID = filter_input(INPUT_POST, 'listID');

        // Update Form title and description
        $Form->getField('title')->setValue($title);
        $Form->getField('description')->setValue($description);

        // Create validation object
        $Validate = new Validate($Form);

        // Validate title and description
        $Validate->text('title', $title, true, 1, 24);
        $Validate->text('description', $description, false, 1, 2000);

        // Set fields array for response
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Get board lists to display in dropdown menu
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        // Add subtasks to the Form object for validation
        $subtasks = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'description' && $key != 'action' && $key != 'listID') {
                // Get the user input
                $value_f = filter_input(INPUT_POST, $key);

                // Add to the Form object
                $Form->addField($key);
                $Form->getField($key)->setValue($value_f);

                // Validate the input
                $Validate->text($key, $value_f, true, 1, 300);

                // Set a custom error message if the input error is 'Required'
                if ($Form->getField($key)->hasError()) {
                    $Form->getField($key)->setError('Subtasks must be 1 to 300 characters long.');
                }

                // Add to subtasks array to send in response
                $subtasks[] = $Form->getField($key);
            }
        }

        // Responses
        if ($Form->hasErrors()) {
            $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields, 'lists' => $lists, 'subtasks' => $subtasks];
            echo json_encode($response);
        } else {
            // Add new task to the database
            $TasksDB = new TasksDB();
            $TasksDB->addTask($currentBoardID, $listID, $title, $description);

            // Get the newly added task's taskID
            $taskID = $TasksDB->getTaskID($title, $listID);

            // Add subtasks
            $SubtasksDB = new SubtasksDB();
            foreach ($subtasks as $subtask) {
                $subtaskValue = $subtask->getValue();
                $SubtasksDB->addSubtask($taskID, $subtaskValue, 'unchecked');
            }

            // Response
            $response = ['success' => true, 'fields' => $fields, 'lists' => $lists,
                'subtasks' => $subtasks];
            echo json_encode($response);
        }
        break;
}
