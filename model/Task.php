<?php
// ------------------------------------------------------------------------------
// Represents a task
// ------------------------------------------------------------------------------
class Task implements JsonSerializable
{
    private $taskID, $boardID, $listID, $title, $description, $dueDate, $dateComplete,
        $priority, $subtasks = [];

//    // ------------------------------------------------------------------------------
//    // Constructor
//    // ------------------------------------------------------------------------------
//    public function __construct($taskID, $boardID, $listID, $title, $description, $dueDate,
//                                $dateComplete, $priority)
//    {
//        $this->taskID = $taskID;
//        $this->boardID = $boardID;
//        $this->listID = $listID;
//        $this->title = $title;
//        $this->description = $description;
//        $this->dueDate = $dueDate;
//        $this->dateComplete = $dateComplete;
//        $this->priority = $priority;
//    }

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
    }

    // ------------------------------------------------------------------------------
    // Json serialize
    // ------------------------------------------------------------------------------
    public function jsonSerialize(): mixed
    {
        return array_filter(
            [
                'taskID' => $this->taskID,
                'boardID' => $this->boardID,
                'listID' => $this->listID,
                'title' => $this->title,
                'description' => $this->description,
                'dueDate' => $this->dueDate,
                'dateComplete' => $this->dateComplete,
                'priority' => $this->priority,
                'subtasks' => $this->subtasks,
            ],
            function ($value) {
                return !is_null($value);
            }
        );
    }

    // ------------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------------
    public function getTaskID()
    {
        return $this->taskID;
    }

    public function getBoardID()
    {
        return $this->boardID;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getListID()
    {
        return $this->listID;
    }

    public function getDueDate()
    {
        return $this->dueDate;
    }

    public function getDateComplete()
    {
        return $this->dateComplete;
    }

    public function getPriority()
    {
        return $this->priority;
    }

    public function getSubtasks()
    {
        return $this->subtasks;
    }

    // ------------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------------
    public function setTaskID($taskID): void
    {
        $this->taskID = $taskID;
    }

    public function setBoardID($boardID): void
    {
        $this->boardID = $boardID;
    }

    public function setTitle($title): void
    {
        $this->title = $title;
    }

    public function setDescription($description): void
    {
        $this->description = $description;
    }

    public function setListID($listID): void
    {
        $this->listID = $listID;
    }

    public function setDueDate($dueDate): void
    {
        $this->dueDate = $dueDate;
    }

    public function setDateComplete($dateComplete): void
    {
        $this->dateComplete = $dateComplete;
    }

    public function setPriority($priority): void
    {
        $this->priority = $priority;
    }

    public function setSubtasks($subtasks): void
    {
        $this->subtasks = $subtasks;
    }
}