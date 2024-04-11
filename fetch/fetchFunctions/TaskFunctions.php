<?php

require_once '../util/main.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

class TaskFunctions
{
    // View task details
    // ------------------------------------------------------------------------------
    public function viewTask()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $task = $TasksDB->getTask($taskID);

        $SubtasksDB = new SubtasksDB();
        $subtasks = $SubtasksDB->getSubtasks($taskID);

        Response::sendResponse(true, ['task' => $task, 'subtasks' => $subtasks]);
    }

    // Show 'Add Task' form
    // ------------------------------------------------------------------------------
    public function showAddTaskForm()
    {
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

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
            $subtasks]);
    }

    // Add task to a list
    // ------------------------------------------------------------------------------
    public function addTask()
    {
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
            Response::sendResponse(false, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
                $subtasks], 'Input errors');
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
            Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists,
                'subtasks' => $subtasks]);
        }
    }

    // Show 'Edit Task' form
    // ------------------------------------------------------------------------------
    public function showEditTaskForm()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $task = $TasksDB->getTask($taskID);
        $title = $task->getTitle();
        $description = $task->getDescription();

        // Create form
        $Form = new Form();
        $formFields = ['title', 'description'];
        $Form->addFields($formFields);
        $Form->getField('title')->setValue($title);
        $Form->getField('description')->setValue($description);
        $Form->getField('title')->setType('text');
        $Form->getField('description')->setType('textarea');

        // Fields array
        $fields = [$Form->getField('title'), $Form->getField('description')];

        // Lists for dropdown menu
        $TaskListsDB = new TaskListsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $TaskListsDB->getAllLists($currentBoardID);

        $SubtasksDB = new SubtasksDB();
        $subtasksData = $SubtasksDB->getSubtasks($taskID);
        $_SESSION['subtasksToDelete'] = [];
        $subtasks = [];
        foreach ($subtasksData as $subtask) {
            $subtaskID = $subtask->getSubtaskID();
            $description = $subtask->getDescription();
            $Form->addField($subtaskID);
            $Form->getField($subtaskID)->setValue($description);
            $subtasks[] = $Form->getField($subtaskID);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists,
            'subtasks' => $subtasks, 'task' => $task]);
    }

    // Edit the task
    // ------------------------------------------------------------------------------
    public function editTask()
    {
        $title = filter_input(INPUT_POST, 'title');
        $description = filter_input(INPUT_POST, 'description');
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
            Response::sendResponse(false, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
                $subtasks], 'Input errors');
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

            Response::sendResponse(true);
        }
    }

    // Show 'Delete Task' warning
    // ------------------------------------------------------------------------------
    public function showDeleteTaskWarning()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $task = $TasksDB->getTask($taskID);
        Response::sendResponse(true, ['task' => $task]);
    }

    // Delete task
    // ------------------------------------------------------------------------------
    public function deleteTask()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $TasksDB = new TasksDB();
        $TasksDB->deleteTask($taskID);
        Response::sendResponse(true);
    }
}