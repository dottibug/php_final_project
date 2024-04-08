<?php
// ------------------------------------------------------------------------------
// Represents a list
// ------------------------------------------------------------------------------

class TaskList implements JsonSerializable
{
    private $listID, $boardID, $title, $color, $tasks = [];

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
                'listID' => $this->listID,
                'boardID' => $this->boardID,
                'title' => $this->title,
                'color' => $this->color,
                'tasks' => $this->tasks,
            ],
            function ($value) {
                return !is_null($value);
            }
        );
    }

    // ------------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------------
    public function getListID()
    {
        return $this->listID;
    }

    public function getBoardID()
    {
        return $this->boardID;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getColor()
    {
        return $this->color;
    }

    public function getTasks()
    {
        return $this->tasks;
    }


    // ------------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------------
    public function setListID($listID): void
    {
        $this->listID = $listID;
    }

    public function setBoardID($boardID): void
    {
        $this->boardID = $boardID;
    }

    public function setTitle($title): void
    {
        $this->title = $title;
    }

    public function setColor($color): void
    {
        $this->color = $color;
    }

    public function setTasks($tasks): void
    {
        $this->tasks = $tasks;
    }

    public function addTask($task)
    {
        $this->tasks[] = $task;
    }


}