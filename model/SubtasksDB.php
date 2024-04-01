<?php
// ------------------------------------------------------------------------------
// Interacts with the subtasks table
// ------------------------------------------------------------------------------
require_once 'Database.php';
require_once 'Subtask.php';

class SubtasksDB
{
    private $db;

    // ------------------------------------------------------------------------------
    //  Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // ------------------------------------------------------------------------------
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
                $Subtask = new Subtask(
                    $row['subtaskID'],
                    $row['taskID'],
                    $row['description'],
                    $row['status']
                );
                $subtasks[] = $Subtask;
            }
            return $subtasks;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    //  Get HTML for subtasks progress
    // ------------------------------------------------------------------------------
    public function getSubtasksProgressHTML($taskID)
    {
        // Get subtasks by taskID
        $Subtasks = $this->getSubtasks($taskID);

        // Count total and checked subtasks
        $totalSubtasks = count($Subtasks);
        $checkedSubtasks = 0;
        foreach ($Subtasks as $Subtask) {
            if ($Subtask->getStatus() == 'checked') {
                $checkedSubtasks++;
            }
        }

        // HTML
        $html = '<p class="taskProgress">' . $checkedSubtasks . " of " .
            $totalSubtasks . " subtasks" . '</p>';

        return $html;
    }

    // ------------------------------------------------------------------------------
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
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }
}