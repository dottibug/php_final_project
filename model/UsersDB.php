<?php
require_once 'Database.php';
require_once 'User.php';

class UsersDB
{
    private $db;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->db = Database::getDB();
    }

    // Check for a valid user
    // ------------------------------------------------------------------------------
    public function validUser($username, $password)
    {
        try {
            $query = 'SELECT password FROM users WHERE username = :username';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':username', $username);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if (!$row) {
                return false;
            } else {
                $hash = $row['password'];
                return password_verify($password, $hash);
            }

        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }

    // Get user by username
    // ------------------------------------------------------------------------------
    public function getUser($username)
    {
        try {
            $query = 'SELECT * FROM users WHERE username = :username';
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':username', $username);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            // Create and return new user
            return new User(
                $row['userID'],
                $row['username'],
                $row['email'],
                $row['password']
            );

        } catch (PDOException $e) {
            Database::showDatabaseError($e->getMessage());
            return false;
        }
    }
}