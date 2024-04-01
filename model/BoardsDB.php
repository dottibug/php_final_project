<?php
// ------------------------------------------------------------------------------
// Interacts with the boards table
// ------------------------------------------------------------------------------
require_once 'Database.php';
require_once 'Board.php';
require_once 'TaskList.php';
require_once 'Task.php';
require_once 'Subtask.php';

class BoardsDB
{
    private $db;

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // ------------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------------
    // Get number of boards by userID
    // ------------------------------------------------------------------------------
    public function getNumberOfBoards($userID)
    {
        try {
            $query = 'SELECT COUNT(*) AS count FROM boards WHERE userID = :userID';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':userID', $userID);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();
            return $result['count'];
        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------------
    // Get lists, tasks, and subtasks count by boardID
    // ------------------------------------------------------------------------------
    public function getBoardDetails($boardID)
    {
        try {
            $query = '
            SELECT 
                b.boardID,
                l.listID, l.title AS listTitle, l.color,
                t.taskID, t.title AS taskTitle, 
                s.subtaskID, s.status
            FROM boards b
                LEFT JOIN lists l ON b.boardID = l.boardID
                LEFT JOIN tasks t ON l.listID = t.listID
                LEFT JOIN subtasks s ON t.taskID = s.taskID
            WHERE b.boardID = :boardID
                ORDER BY b.boardID, l.listID, t.taskID, s.subtaskID';

            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':boardID', $boardID);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            $boards = [];
            foreach ($rows as $row) {
                $boardID = $row['boardID'];
                // Add the board if it hasn't been added yet
                if ($boardID) {
                    if (!isset($boards[$boardID])) {
                        $board = new Board();
                        $board->setBoardID($row['boardID']);
                        $board->setLists([]);
                        $boards[$boardID] = $board;
                    }
                } else {
                    continue;
                }

                // If there is a listID, add it to the current board
                $currentBoard = $boards[$boardID];
                $listID = $row['listID'];
                if ($listID) {
                    $lists = $currentBoard->getLists();
                    // Add list to lists array
                    if (!isset($lists[$listID])) {
                        $list = new TaskList();
                        $list->setListID($row['listID']);
                        $list->setTitle($row['listTitle']);
                        $list->setColor($row['color']);
                        $list->setTasks([]);
                        $lists[$listID] = $list;
                    }
                    // Update the board's lists
                    $currentBoard->setLists($lists);
                } else {
                    continue;
                }

                // If there is a taskID, add it to the current list
                $currentList = $lists[$listID];
                $taskID = $row['taskID'];
                if ($taskID) {
                    $tasks = $currentList->getTasks();
                    // Add task to the tasks array
                    if (!isset($tasks[$taskID])) {
                        $task = new Task();
                        $task->setTaskID($row['taskID']);
                        $task->setTitle($row['taskTitle']);
                        $task->setSubtasks([]);
                        $tasks[$taskID] = $task;
                    }
                    // Update the list's tasks
                    $currentList->setTasks($tasks);
                } else {
                    continue;
                }


                // If there is a subtaskID, add it to the current task
                $currentTask = $tasks[$taskID];
                $subtaskID = $row['subtaskID'];
                if ($subtaskID) {
                    $subtasks = $currentTask->getSubtasks();
                    // Add subtask to the subtasks array
                    if (!isset($subtasks[$subtaskID])) {
                        $subtask = new Subtask();
                        $subtask->setSubtaskID($row['subtaskID']);
                        $subtask->setStatus($row['status']);
                        $subtasks[$subtaskID] = $subtask;
                    }
                    // Update the task's subtasks
                    $currentTask->setSubtasks($subtasks);
                } else {
                    continue;
                }

                // Clear the reference arrays for the next iteration
                unset($currentBoard, $currentBoardList, $currentBoardListTask);
            }

            // Make sure $boards is treated as an array if encoded to json
            return array_values($boards);

        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // ------------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------------
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

    // ------------------------------------------------------------------------------
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
