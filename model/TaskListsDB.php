<?php
// ------------------------------------------------------------------------------
// Interacts with the lists table
// ------------------------------------------------------------------------------
require_once 'Database.php';
require_once 'TaskList.php';

class TaskListsDB
{
    private $db;
    private $lists = [];

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // ------------------------------------------------------------------------------
    // Get all lists by boardID
    // ------------------------------------------------------------------------------
    public function getAllLists($boardID)
    {
        try {
            $query = "SELECT * FROM lists WHERE boardID = :boardID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            // Create array of TaskList objects
            $lists = [];
            foreach ($rows as $row) {
                $List = new TaskList();
                $List->setListID($row['listID']);
                $List->setTitle($row['title']);
                $List->setColor($row['color']);
                $lists[] = $List;
            }

            return $lists;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Get list title by listID
    // ------------------------------------------------------------------------------
    public function getListTitle($listID)
    {
        try {
            $query = "SELECT * FROM lists WHERE listID = :listID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row['title'];
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Check if list exists in database
    // ------------------------------------------------------------------------------
    public function listExists($listID)
    {
        try {
            $query = "SELECT * FROM lists WHERE listID = :listID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
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
    // Get number of tasks in list
    // ------------------------------------------------------------------------------
    public function getNumberOfTasks($listID)
    {
        try {
            $query = "SELECT COUNT(*) AS count FROM tasks WHERE listID = :listID";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue('listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch();
            $stmt->closeCursor();
            return $row['count'];
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Add list
    // ------------------------------------------------------------------------------
    public function addList($boardID, $title, $color = '')
    {
        try {
            if ($color) {
                $query = 'INSERT INTO lists (boardID, title, color) VALUES (:boardID, :title, :color)';
            } else {
                $query = 'INSERT INTO lists (boardID, title) VALUES (:boardID, :title)';
            }
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->bindValue(':title', $title);
            if ($color) {
                $stmt->bindValue(':color', $color);
            }
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Delete list
    // ------------------------------------------------------------------------------
    public function deleteList($listID)
    {
        try {
            $query = 'DELETE FROM lists WHERE listID = :listID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Update list
    // ------------------------------------------------------------------------------
    public function updateList($listID, $title)
    {
        try {
            $query = 'UPDATE lists SET title = :title WHERE listID = :listID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Get list by listID
    // ------------------------------------------------------------------------------
    public function getList($listID)
    {
        try {
            $query = 'SELECT * FROM lists WHERE listID = :listID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':listID', $listID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $list = new TaskList();
            $list->setListID($listID);
            $list->setBoardID($row['boardID']);
            $list->setTitle($row['title']);
            $list->setColor($row['color']);
            
            return $list;


        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }
}
