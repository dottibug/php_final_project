<?php
// ------------------------------------------------------------------------------
// Handles user authentication
// ------------------------------------------------------------------------------
require_once 'util/main.php';
require_once 'UsersDB.php';

class Auth
{
    // ------------------------------------------------------------------------------
    // Show login form if there is no existing session for the user
    // ------------------------------------------------------------------------------
    public static function handleShowLogin(&$LoginForm): void
    {
        // Skip login if the user has an existing session
        if (isset($_SESSION['validUser']) && $_SESSION['validUser']) {
            $location = 'board';
            header("Location: $location");
            exit;
        } else {
            $username = '';
            $password = '';
            include 'view/login.php';
        }
    }

    // ------------------------------------------------------------------------------
    // Handle user login
    // ------------------------------------------------------------------------------
    public static function handleLogin(&$LoginForm, &$Validate): void
    {
        // Get the login form data
        $username = filter_input(INPUT_POST, 'username');
        $password = filter_input(INPUT_POST, 'password');

        // Validate the form
        $Validate->text('username', $username, true, 1, 50);
        $Validate->text('password', $password, true, 1, 50);

        // Check for form errors
        if ($LoginForm->hasErrors()) {
            include 'view/login.php';
        } else {
            // Check username and password
            $UsersDB = new UsersDB();
            $validUser = $UsersDB->validUser($username, $password);

            // Show field errors if the user is not valid
            if (!$validUser) {
                $err_msg = 'Incorrect username or password';
                $LoginForm->getField('username')->setError($err_msg);
                $LoginForm->getField('password')->setError($err_msg);
                include 'view/login.php';
            } else {
                // Create User object
                $User = $UsersDB->getUser($username);

                // Regenerate session id and create validUser cookies
                $_SESSION = array();
                session_regenerate_id(true);
                $_SESSION['validUser'] = true;
                $_SESSION['username'] = $User->getUsername();
                $_SESSION['userID'] = $User->getUserID();
                header('Location: ../board');
                exit;
            }
        }
    }
}