<?php
require_once 'Database.php';
require_once 'Subtask.php';

// Interacts with the subtasks table
// ------------------------------------------------------------------------------
class SubtasksDB
{
    private $db;

    //  Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    //  Get subtasks by taskID
    // ------------------------------------------------------------------------------
    public function getSubtasks($taskID)
    {
        try {
            $query = "SELECT * FROM subtasks WHERE taskID = :taskID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(":taskID", $taskID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            // Create array of Subtask objects
            $subtasks = [];
            foreach ($rows as $row) {
                $subtask = new Subtask();
                $subtask->setSubtaskID($row['subtaskID']);
                $subtask->setTaskID($row['taskID']);
                $subtask->setDescription($row['description']);
                $subtask->setStatus($row['status']);
                $subtasks[] = $subtask;
            }
            return $subtasks;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    //  Update subtask status
    // ------------------------------------------------------------------------------
    public function updateStatus($status, $subtaskID)
    {
        try {
            $query = "UPDATE subtasks SET status = :status WHERE subtaskID = :subtaskID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(":status", $status);
            $stmt->bindValue(':subtaskID', $subtaskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    //  Add subtask
    // ------------------------------------------------------------------------------
    public function addSubtask($taskID, $description, $status)
    {
        try {
            $query = 'INSERT INTO subtasks (taskID, description, status) VALUES (:taskID, :description, :status)';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->bindValue(':description', $description);
            $stmt->bindValue(':status', $status);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    //  Delete subtask
    // ------------------------------------------------------------------------------
    public function deleteSubtask($subtaskID)
    {
        try {
            $query = 'DELETE FROM subtasks WHERE subtaskID = :subtaskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':subtaskID', $subtaskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    //  Check if subtasks exists in the database
    // ------------------------------------------------------------------------------
    public function subtaskExists($subtaskID)
    {
        try {
            $query = "SELECT * FROM subtasks WHERE subtaskID = :subtaskID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':subtaskID', $subtaskID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if ($row) {
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    //  Update subtask description
    // ------------------------------------------------------------------------------
    public function updateSubtaskDescription($subtaskID, $description)
    {
        try {
            $query = "UPDATE subtasks SET description = :description WHERE subtaskID = :subtaskID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':description', $description);
            $stmt->bindValue(':subtaskID', $subtaskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

}