<?php
require_once 'Database.php';
require_once 'Task.php';
require_once 'TaskListsDB.php';
require_once 'Subtask.php';

class TasksDB
{
    private $db;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // Add task
    // ------------------------------------------------------------------------------
    public function addTask($boardID, $listID, $title, $description)
    {
        try {
            $query = 'INSERT INTO tasks (boardID, listID, title, description) VALUES (:boardID, :listID, :title, :description)';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->bindValue(':listID', $listID);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':description', $description);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Get a task's listID
    // ------------------------------------------------------------------------------
    public function getListIDForTask($taskID)
    {
        try {
            $query = 'SELECT * FROM tasks WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row['listID'];
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Get taskID by task title and listID
    // ------------------------------------------------------------------------------
    public function getTaskID($title, $listID)
    {
        try {
            $query = 'SELECT * FROM tasks WHERE title = :title AND listID = :listID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row['taskID'];
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Get task by taskID
    // ------------------------------------------------------------------------------
    public function getTask($taskID)
    {
        try {
            $query = 'SELECT * FROM tasks WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $taskListsDB = new TaskListsDB();
            $listTitle = $taskListsDB->getListTitle($row['listID']);

            $task = new Task();
            $task->setTaskID($row['taskID']);
            $task->setBoardID($row['boardID']);
            $task->setListID($row['listID']);
            $task->setTitle($row['title']);
            $task->setDescription($row['description']);
            $task->setListTitle($listTitle);

            return $task;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Update task title
    // ------------------------------------------------------------------------------
    public function updateTaskTitle($taskID, $title)
    {
        try {
            $query = 'UPDATE tasks SET title = :title WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Update task description
    // ------------------------------------------------------------------------------
    public function updateTaskDescription($taskID, $description)
    {
        try {
            $query = 'UPDATE tasks SET description = :description WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':description', $description);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Update a task's listID
    // ------------------------------------------------------------------------------
    public function updateListID($taskID, $listID)
    {
        try {
            $query = 'UPDATE tasks SET listID = :listID WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Delete task
    // ------------------------------------------------------------------------------
    public function deleteTask($taskID)
    {
        try {
            $query = 'DELETE FROM tasks WHERE taskID = :taskID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':taskID', $taskID);
            $stmt->execute();
            $stmt->closeCursor();
            return true;
        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }

    // Delete task
    // ------------------------------------------------------------------------------
    public function getSortedTasks($listID, $sortBy)
    {
        if ($sortBy == 'oldest') {
            $query = 'SELECT * FROM tasks WHERE listID = :listID ORDER BY taskID';
        } else $query = 'SELECT * FROM tasks WHERE listID = :listID ORDER BY taskID DESC';

        try {
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $taskListsDB = new TaskListsDB();
            $listTitle = $taskListsDB->getListTitle($listID);

            $tasks = [];
            foreach ($rows as $row) {
                $taskID = $row['taskID'];
                $task = new Task();
                $task->setTaskID($taskID);
                $task->setListID($listID);
                $task->setListTitle($listTitle);
                $task->setTitle($row['title']);
                $task->setDescription($row['description']);
                $task->setSubtasks([]);
                $tasks[$taskID] = $task;
            }

            return $tasks;

        } catch (PDOException $e) {
            Response::sendErrorResponse($e->getMessage());
            return false;
        }
    }
}