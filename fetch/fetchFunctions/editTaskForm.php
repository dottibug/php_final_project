<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/TaskListsDB.php';
require_once 'model/SubtasksDB.php';
require_once 'model/TasksDB.php';
require_once 'model/Subtask.php';

header('Content-Type: application/x-www-form-urlencoded');

function editTaskForm()
{
    try {
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

        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists,
            'subtasks' => $subtasks, 'task' => $task];

        echo json_encode($response);


    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}