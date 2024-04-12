<?php
// Database class. Set up a database connection and handle database errors.
// ------------------------------------------------------------------------------
class Database
{
    private static $dsn = 'mysql:host=localhost;dbname=kanban';
    private static $username = 'kanban_user';
    private static $password = 'sesame';
    private static $db;

    // Get database connection
    // ------------------------------------------------------------------------------
    public static function getDB()
    {
        if (!isset(self::$db)) {
            try {
                self::$db = new PDO(self::$dsn, self::$username, self::$password);
            } catch (PDOException $e) {
                $err_msg = $e->getMessage();
                self::showDatabaseError($err_msg);
            }
        }
        return self::$db;
    }

    // Display database error
    // ------------------------------------------------------------------------------
    public static function showDatabaseError($err_msg): void
    {
        include '../view/databaseError.php';
        exit();
    }
}