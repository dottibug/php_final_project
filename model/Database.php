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
                self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                $message = $e->getMessage();
                self::showDatabaseError($message);
            }
        }
        return self::$db;
    }

    // Display database error
    // ------------------------------------------------------------------------------
    public static function showDatabaseError($message = ''): void
    {
        header('Location: ../view/errorPage.php');
        exit();
    }
}