<?php
// ------------------------------------------------------------------------------
// Interacts with the tasks table
// ------------------------------------------------------------------------------
require_once 'Database.php';
require_once 'Task.php';
require_once 'TaskListsDB.php';

class TasksDB
{
    private $db;
    private $tasks = [];

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // ------------------------------------------------------------------------------
    // Get tasks by boardID
    // ------------------------------------------------------------------------------
    public function getTasks($boardID)
    {
        try {
            $query = "SELECT * FROM tasks WHERE boardID = :boardID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            foreach ($rows as $row) {
                $Task = new Task(
                    $row['taskID'],
                    $row['boardID'],
                    $row['listID'],
                    $row['title'],
                    $row['description'],
                    $row['dueDate'],
                    $row['dateComplete'],
                    $row['priority']
                );
                $this->tasks[] = $Task;
            }
            return $this->tasks;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Get tasks by listID
    // ------------------------------------------------------------------------------
    public function getTasksByListID($listID)
    {
        try {
            $query = "SELECT * FROM tasks WHERE listID = :listID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $tasks = [];
            foreach ($rows as $row) {
                $Task = new Task(
                    $row['taskID'],
                    $row['boardID'],
                    $row['listID'],
                    $row['title'],
                    $row['description'],
                    $row['dueDate'],
                    $row['dateComplete'],
                    $row['priority']
                );
                $tasks[] = $Task;
            }
            return $tasks;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }


    // ------------------------------------------------------------------------------
    // Group tasks by their listID
    // ------------------------------------------------------------------------------
    public function getGroupedTasks($Tasks)
    {
        $TaskListsDB = new TaskListsDB();

        $GroupedTasks = [];
        foreach ($Tasks as $Task) {
            $listID = $Task->getListID();
            $listTitle = $TaskListsDB->getListTitle($listID);
            $GroupedTasks[$listTitle][] = $Task;
        }
        return $GroupedTasks;
    }
}