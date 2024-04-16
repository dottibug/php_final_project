<?php

require_once '../util/main.php';
require_once 'util/response.php';
require_once 'model/SubtasksDB.php';

header('Content-Type: application/x-www-form-urlencoded');

class SubtaskServices
{
    private $form, $subtasksDB, $taskListsDB;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->subtasksDB = new SubtasksDB();
        $this->taskListsDB = new TaskListsDB();
    }

    // Set form
    // ------------------------------------------------------------------------------
    public function setForm(Form $form)
    {
        $this->form = $form;
    }

    // Set up form fields and sanitize user input
    // ------------------------------------------------------------------------------
    private function setupFormFields(Form $form, array $fieldsToExclude)
    {
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                $filteredValue = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $form->addField($key);
                $form->getField($key)->setValue($filteredValue);
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

    // Update subtask status (checked or unchecked)
    // ------------------------------------------------------------------------------
    public function updateSubtaskStatus()
    {
        $taskID = filter_input(INPUT_POST, 'taskID');
        $subtaskID = filter_input(INPUT_POST, 'subtaskID');
        $newStatus = filter_input(INPUT_POST, 'newStatus');

        // Update subtask status
        $this->subtasksDB->updateStatus($newStatus, $subtaskID);

        // Re-fetch subtasks for the task
        $subtasks = $this->subtasksDB->getSubtasks($taskID);

        Response::sendResponse(true, ['subtasks' => $subtasks, 'taskID' => $taskID]);
    }

    // Add subtask
    // ------------------------------------------------------------------------------
    public function addSubtask(Form $form)
    {
        // Create form
        $this->setupFormFields($form, array('action'));

        // Fields array
        $fields = [$form->getField('title'), $form->getField('description')];

        // Lists for dropdown menu
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $this->taskListsDB->getAllLists($currentBoardID);

        // Subtasks array
        $subtasks = $this->getSubtaskFields($form, array('title', 'description', 'action'));

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists,
            'subtasks' => $subtasks]);
    }

    // Delete subtask
    // ------------------------------------------------------------------------------
    public function deleteSubtask(Form $form)
    {
        $itemToDelete = filter_input(INPUT_POST, 'itemToDelete');
        $_SESSION['subtasksToDelete'][] = $itemToDelete;

        // Create form
        $this->setupFormFields($form, array('action', 'itemToDelete', $itemToDelete));

        // Fields array
        $fields = [$form->getField('title'), $form->getField('description')];

        // Lists for dropdown menu
        $currentBoardID = $_SESSION['currentBoardID'];
        $lists = $this->taskListsDB->getAllLists($currentBoardID);

        // Subtasks array
        $subtasks = $this->getSubtaskFields($form, array('title', 'description', 'action', 'itemToDelete', $itemToDelete));

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists, 'subtasks' =>
            array_values($subtasks)]);
    }
}