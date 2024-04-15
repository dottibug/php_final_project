<?php
require_once '../util/main.php';

$lifetime = 60 * 60 * 24 * 7;
session_set_cookie_params($lifetime, '/', '', true);
session_start();

// Only allow valid users access to this page
// ------------------------------------------------------------------------------
if (!$_SESSION['validUser']) {
    header('Location: /kanban/login?action=showLoginForm');
}

include 'mainBoard.php';
