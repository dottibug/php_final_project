<?php
require_once 'util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/Auth.php';

// Start session with a persistent cookie (1 week expiry)
$lifetime = 60 * 60 * 24 * 7; // 1 week in seconds
session_set_cookie_params($lifetime, '/', '', true);
session_start();

// Set cookie for valid user status
if (!isset($_SESSION['validUser'])) {
    $_SESSION['validUser'] = false;
}

// Get action. Default is 'show_login'.
$action = Action::getAction('showLogin');

// Create LoginForm object
$LoginForm = new Form();
$loginFieldNames = array('username', 'password');
$LoginForm->addFields($loginFieldNames);

// Create Validation object for loginForm
$Validate = new Validate($LoginForm);

// Controller
switch ($action) {
    case ('showLogin'):
        Auth::handleShowLogin($LoginForm);
        break;
    case ('login'):
        Auth::handleLogin($LoginForm, $Validate);
        break;
}
