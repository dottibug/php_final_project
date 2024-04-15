<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/UsersDB.php';

$lifetime = 60 * 60 * 24 * 7; // 1 week in seconds
session_set_cookie_params($lifetime, '/', '', true);
session_start();

// Create LoginForm object
$Form = new Form();
$fields = array('username', 'password');
$Form->addFields($fields);

// Create Validation object for loginForm
$Validate = new Validate($Form);

// Get action. Default is 'show_login'.
$action = Action::getAction('showLoginForm');

// Controller
switch ($action) {
    case('showLoginForm'):
        $username = '';
        $password = '';
        include_once 'login/login.php';
        break;
    case('login'):
        // Login form data
        $username = filter_input(INPUT_POST, 'username');
        $password = filter_input(INPUT_POST, 'password');

        // Validate
        $Validate->text('username', $username, true, 1, 50);
        $Validate->text('password', $password, true, 1, 50);

        if ($Form->hasErrors()) {
            include_once 'login/login.php';
        } else {
            // Check for valid username and password
            $UsersDB = new UsersDB();
            $validUser = $UsersDB->validUser($username, $password);

            // Show errors on the login form the user is not valid
            if (!$validUser) {
                $message = 'Incorrect username or password';
                $Form->getField('username')->setError($message);
                $Form->getField('password')->setError($message);
                include_once 'login/login.php';
            } else {
                // Successful login: regenerate session id and create session variables
                $User = $UsersDB->getUser($username);
                session_regenerate_id(true);
                $_SESSION['validUser'] = true;
                $_SESSION['username'] = $User->getUsername();
                $_SESSION['userID'] = $User->getUserID();
                $_SESSION['overlay'] = false;
                header('Location: ../board');
                exit;
            }
        }
        break;
}

