<?php
require_once 'util/main.php';
require_once 'model/Action.php';

// Start session with a persistent cookie (1 week expiry)
$lifetime = 60 * 60 * 24 * 7; // 1 week in seconds
session_set_cookie_params($lifetime, '/', '', true);
session_start();

// Set cookie for valid user status
if (!isset($_SESSION['validUser'])) {
    $_SESSION['validUser'] = false;
}

// Get action
$action = Action::getAction('checkValidUserSession');

// Controller
switch ($action) {
    case('checkValidUserSession'):
        if (isset($_SESSION['validUser']) && $_SESSION['validUser']) {
            header('Location: ../board');
        } else {
            header('Location: login?action=showLoginForm');
            exit;
        }
        break;
}
