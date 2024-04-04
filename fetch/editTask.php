<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

$action = Action::getAction('showEditTaskForm');

// Instantiate classes
$TaskListsDB = new TaskListsDB();

// Create form
$Form = new Form();

// Add form fields
$formFields = ['title', 'description', 'list'];
$Form->addFields($formFields);

// Get current board id
$currentBoardID = $_SESSION['currentBoardID'];

// Controller
switch ($action) {
    case('addSubtask'):
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
}