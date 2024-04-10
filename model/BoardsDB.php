<?php
// ------------------------------------------------------------------------------
// Interacts with the boards table
// ------------------------------------------------------------------------------
require_once 'Database.php';
require_once 'Board.php';
require_once 'TaskList.php';
require_once 'Task.php';
require_once 'Subtask.php';
require_once 'TasksDB.php';
require_once 'SubtasksDB.php';

class BoardsDB
{
    private $db;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // Get boards by userID
    // ------------------------------------------------------------------------------
    public function getBoards($userID)
    {
        try {
            $query = 'SELECT * FROM boards WHERE userID = :userID ORDER BY boardID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':userID', $userID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $boards = [];
            foreach ($rows as $row) {
                $board = new Board();
                $board->setBoardID($row['boardID']);
                $board->setUserID($row['userID']);
                $board->setTitle($row['title']);
                $boards[] = $board;
            }

            return $boards;

        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Get board title by boardID
    // ------------------------------------------------------------------------------
    public function getBoardTitle($boardID)
    {
        try {
            $query = 'SELECT * FROM boards WHERE boardID = :boardID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row['title'];
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Get lists, tasks, and subtasks count by boardID
    // ------------------------------------------------------------------------------
    public function getBoardDetails($boardID)
    {
        try {
            // Boards
            $boards = [];
            $queryBoards = 'SELECT * FROM boards WHERE boardID = :boardID';
            $stmtBoards = $this->db->prepare($queryBoards);
            $stmtBoards->bindValue(':boardID', $boardID);
            $stmtBoards->execute();
            $boardRows = $stmtBoards->fetchAll(PDO::FETCH_ASSOC);
            $stmtBoards->closeCursor();

            foreach ($boardRows as $row) {
                $board = new Board();
                $board->setBoardID($row['boardID']);
                $board->setTitle($row['title']);
                $board->setLists([]);
                $boards[$boardID] = $board;
            }

            // Board lists
            $queryLists = 'SELECT * FROM lists WHERE boardID = :boardID';
            $stmtLists = $this->db->prepare($queryLists);
            $stmtLists->bindValue(':boardID', $boardID);
            $stmtLists->execute();
            $listRows = $stmtLists->fetchAll(PDO::FETCH_ASSOC);
            $stmtLists->closeCursor();

            foreach ($listRows as $row) {
                $listID = $row['listID'];
                $boardID = $row['boardID'];
                $list = new TaskList();
                $list->setListID($listID);
                $list->setBoardID($boardID);
                $list->setTitle($row['title']);
                $list->setColor($row['color']);
                $list->setTasks([]);
                $boards[$boardID]->addList($list);
            }

            // Board tasks
            foreach ($boards as $board) {
                $lists = $board->getLists();
                foreach ($lists as $list) {
                    $listID = $list->getListID();
                    // Check if the user has selected a sort order for this list
                    if (isset($_SESSION['sortOrder'][$listID])) {
                        $sortOrder = $_SESSION['sortOrder'][$listID];
                    } else {
                        $sortOrder = 'oldest'; // default to ascending
                    }
                    // Get tasks
                    $TasksDB = new TasksDB();
                    $tasks = $TasksDB->getSortedTasks($listID, $sortOrder);
                    // Add tasks to the list
                    foreach ($tasks as $task) {
                        $list->addTask($task);
                    }
                }
            }

            // Board subtasks
            foreach ($boards as $board) {
                $lists = $board->getLists();
                foreach ($lists as $list) {
                    $tasks = $list->getTasks();
                    // Get subtasks for each task
                    foreach ($tasks as $task) {
                        $taskID = $task->getTaskID();
                        $SubtasksDB = new SubtasksDB();
                        $subtasks = $SubtasksDB->getSubtasks($taskID);
                        foreach ($subtasks as $subtask) {
                            $task->addSubtask($subtask);
                        }
                    }
                }
            }

            return array_values($boards);

        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Get board ID by title
    // ------------------------------------------------------------------------------
    public function getBoardID($title)
    {
        try {
            $query = 'SELECT * FROM boards WHERE title = :title';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $title);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row['boardID'];
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Add a new board
    // ------------------------------------------------------------------------------
    public function addBoard($userID, $title)
    {
        try {
            $query = "INSERT INTO boards (userID, title) VALUES (:userID, :title)";
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':userID', $userID);
            $stmt->bindValue(':title', $title);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Delete a new board
    // ------------------------------------------------------------------------------
    public function deleteBoard($boardID)
    {
        try {
            $query = 'DELETE FROM boards WHERE boardID = :boardID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $row;
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Update board
    // ------------------------------------------------------------------------------
    public function updateBoard($boardID, $title)
    {
        try {
            $query = 'UPDATE boards SET title = :title WHERE boardID = :boardID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':boardID', $boardID);
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
