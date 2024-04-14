<?php

require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TasksDB.php';
require_once 'model/TaskListsDB.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

class TaskFunctions
{
    private $form, $validate, $tasksDB, $taskListsDB, $subtasksDB;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->tasksDB = new TasksDB();
        $this->taskListsDB = new TaskListsDB();
        $this->subtasksDB = new SubtasksDB();
    }

    // Set form
    // ------------------------------------------------------------------------------
    public function setForm(Form $form)
    {
        $this->form = $form;
    }

    // Set validate
    // ------------------------------------------------------------------------------
    public function setValidate(Form $form)
    {
        $this->validate = new Validate($form);
    }

    // Set up form fields with sanitized user input and validate for field errors
    // ------------------------------------------------------------------------------
    private function setupFormFields(Form $form, array $fieldsToExclude)
    {
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                // Sanitize user input
                $filteredValue = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $form->addField($key);
                $form->getField($key)->setValue($filteredValue);

                // Set input type
                if ($key == 'description') {
                    $form->getField($key)->setType('textarea');
                } else {
                    $form->getField($key)->setType('text');
                }

                // Validate input
                $this->setValidate($form);
                if ($key == 'title') {
                    $this->validate->text('title', $filteredValue, true, 1, 24);
                } elseif ($key == 'description') {
                    $this->validate->text('description', $filteredValue, false, 1, 2000);
                } else {
                    $this->validate->text($key, $filteredValue, true, 1, 300);
                }

                // Set custom error for subtask field errors
                if ($form->getField($key)->hasError()) {
                    if ($key != 'title' && $key !== 'description') {
                        $form->getField($key)->setError('Subtasks must be 1 to 300 characters long.');
                    }
                } else {
                    // Clear any previous errors if there are no current errors
                    $form->getField($key)->clearError();
                }
            }
        }
    }

    // Get subtask fields
    // ------------------------------------------------------------------------------
    private function getSubtaskFields(Form $form, array $fieldsToExclude)
    {
        $subtasks = [];
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                $subtasks[] = $form->getField($key);
            }
        }
        return $subtasks;
    }

    // View task details
    // ------------------------------------------------------------------------------
    public function viewTask()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $task = $this->tasksDB->getTask($taskID);
        $subtasks = $this->subtasksDB->getSubtasks($taskID);

        Response::sendResponse(true, ['task' => $task, 'subtasks' => $subtasks]);
    }

    // Show 'Add Task' form
    // ------------------------------------------------------------------------------
    public function showAddTaskForm(Form $form)
    {
        $listID = filter_input(INPUT_POST, 'listID');
        $listID = (int)$listID;

        $form->addFields(['title', 'description', 'list']);
        $form->getField('title')->setType('text');
        $form->getField('description')->setType('textarea');

        // Fields array for response
        $fields = [$form->getField('title'), $form->getField('description')];

        // Board lists array for response
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $this->taskListsDB->getAllLists($currentBoardID);

        // Create subtasks to delete in session (only deleted when user clicks 'save changes')
        $_SESSION['subtasksToDelete'] = [];

        // Create two empty subtask fields
        $defaultSubtasks = ['subtask1', 'subtask2'];
        $form->addFields($defaultSubtasks);

        $subtasks = [];
        foreach ($defaultSubtasks as $subtask) {
            $form->getField($subtask)->setType('text');
            $subtasks[] = $form->getField($subtask);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
            $subtasks, 'selectedID' => $listID]);
    }

    // Add task to a list
    // ------------------------------------------------------------------------------
    public function addTask(Form $form)
    {
        $listID = filter_input(INPUT_POST, 'listID');

        // Set up and validate form fields
        $this->setupFormFields($form, array('action', 'listID'));

        // Fields array
        $fields = [$form->getField('title'), $form->getField('description')];

        // Lists for dropdown menu
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $this->taskListsDB->getAllLists($currentBoardID);

        // Subtasks
        $subtasks = $this->getSubtaskFields($form, array('title', 'description', 'action',
            'listID'));

        // Response
        if ($form->hasErrors()) {
            Response::sendResponse(false, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
                $subtasks], 'Input errors');
        } else {
            // Add the new task (using the sanitized values) and get the new task's ID
            $title = $form->getField('title')->getValue();
            $description = $form->getField('description')->getValue();
            $this->tasksDB->addTask($currentBoardID, $listID, $title, $description);
            $taskID = $this->tasksDB->getTaskID($title, $listID);

            // Add subtasks
            foreach ($subtasks as $subtask) {
                $subtaskValue = $subtask->getValue();
                $this->subtasksDB->addSubtask($taskID, $subtaskValue, 'unchecked');
            }
            Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists,
                'subtasks' => $subtasks]);
        }
    }

    // Show 'Edit Task' form
    // ------------------------------------------------------------------------------
    public function showEditTaskForm(Form $form)
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $task = $this->tasksDB->getTask($taskID);
        $title = $task->getTitle();
        $description = $task->getDescription();

        $form->addField('title');
        $form->getField('title')->setValue($title);
        $form->getField('title')->setType('text');

        $form->addField('description');
        $form->getField('description')->setValue($description);
        $form->getField('description')->setType('textarea');

        // Fields array
        $fields = [$form->getField('title'), $form->getField('description')];

        // Lists for dropdown menu
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $this->taskListsDB->getAllLists($currentBoardID);

        // Subtasks
        $_SESSION['subtasksToDelete'] = [];
        $subtasksData = $this->subtasksDB->getSubtasks($taskID);

        $subtasks = [];
        foreach ($subtasksData as $subtask) {
            $subtaskID = $subtask->getSubtaskID();
            $description = $subtask->getDescription();
            $form->addField($subtaskID);
            $form->getField($subtaskID)->setValue($description);
            $subtasks[] = $form->getField($subtaskID);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists,
            'subtasks' => $subtasks, 'task' => $task]);
    }

    // Save changes to task
    // ------------------------------------------------------------------------------
    public function editTask(Form $form)
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $listID = filter_input(INPUT_POST, 'listID');
        $listID = (int)$listID;

        // Create form
        $this->setupFormFields($form, ['action', 'listID', 'taskID']);

        // Fields array
        $fields = [$form->getField('title'), $form->getField('description')];

        // Subtasks
        $subtasks = $this->getSubtaskFields($form, ['title', 'description', 'action', 'listID', 'taskID']);

        // Responses
        if ($form->hasErrors()) {
            // Lists for dropdown menu
            $currentBoardID = $_SESSION['currentBoardID'];
            $lists = $this->taskListsDB->getAllLists($currentBoardID);

            Response::sendResponse(false, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
                $subtasks, 'selectedID' => $listID], 'Input errors');
        } else {
            // Update the task title and description
            $title = $form->getField('title')->getValue();
            $description = $form->getField('description')->getValue();
            $this->tasksDB->updateTaskTitle($taskID, $title);
            $this->tasksDB->updateTaskDescription($taskID, $description);

            // Move task to another list, if necessary
            $prevListID = $this->tasksDB->getListIDForTask($taskID);

            if ($prevListID != $listID) {
                $this->tasksDB->updateListID($taskID, $listID);
            }

            // Delete subtasksToDelete from the database
            $subtasksToDelete = $_SESSION['subtasksToDelete'];
            foreach ($subtasksToDelete as $subtask) {
                $this->subtasksDB->deleteSubtask($subtask);
            }

            // Update or add the remaining subtasks
            foreach ($subtasks as $subtask) {
                $subtaskID = $subtask->getName();
                $subtaskExists = $this->subtasksDB->subtaskExists($subtaskID);

                if ($subtaskExists) {
                    $subtaskValue = $subtask->getValue();
                    $this->subtasksDB->updateSubtaskDescription($subtaskID, $subtaskValue);
                } else {
                    $subtaskValue = $subtask->getValue();
                    $this->subtasksDB->addSubtask($taskID, $subtaskValue, 'unchecked');
                }
            }

            Response::sendResponse(true, ['selectedID' => $listID]);
        }
    }

    // Show 'Delete Task' warning
    // ------------------------------------------------------------------------------
    public function showDeleteTaskWarning()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $task = $this->tasksDB->getTask($taskID);
        Response::sendResponse(true, ['task' => $task]);
    }

    // Delete task
    // ------------------------------------------------------------------------------
    public function deleteTask()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $this->tasksDB->deleteTask($taskID);
        Response::sendResponse(true);
    }
}