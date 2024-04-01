<?php
// ------------------------------------------------------------------------------
//  Represents a subtask
// ------------------------------------------------------------------------------

class Subtask implements JsonSerializable
{
    private $subtaskID, $taskID, $description, $status;

//    // ------------------------------------------------------------------------------
//    //  Constructor
//    // ------------------------------------------------------------------------------
//    public function __construct($subtaskID, $taskID, $description, $status)
//    {
//        $this->subtaskID = $subtaskID;
//        $this->taskID = $taskID;
//        $this->description = $description;
//        $this->status = $status;
//    }

    // ------------------------------------------------------------------------------
    //  Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
    }

    // ------------------------------------------------------------------------------
    //  Json serialize
    // ------------------------------------------------------------------------------
    public function jsonSerialize(): mixed
    {
        return array_filter(
            [
                'subtaskID' => $this->subtaskID,
                'taskID' => $this->taskID,
                'description' => $this->description,
                'status' => $this->status,
            ],
            function ($value) {
                return !is_null($value);
            }
        );
    }

    // ------------------------------------------------------------------------------
    //  Getters
    // ------------------------------------------------------------------------------
    public function getSubtaskID()
    {
        return $this->subtaskID;
    }

    public function getTaskID()
    {
        return $this->taskID;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getStatus()
    {
        return $this->status;
    }

    // ------------------------------------------------------------------------------
    //  Setters
    // ------------------------------------------------------------------------------
    public function setSubtaskID($subtaskID): void
    {
        $this->subtaskID = $subtaskID;
    }

    public function setTaskID($taskID): void
    {
        $this->taskID = $taskID;
    }

    public function setDescription($description): void
    {
        $this->description = $description;
    }

    public function setStatus($status): void
    {
        $this->status = $status;
    }
}

?>