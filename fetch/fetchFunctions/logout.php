<?php
require_once '../util/main.php';

header('Content-Type: application/x-www-form-urlencoded');

// Handle logout (clear session, destroy session, return to index)
// ------------------------------------------------------------------------------
function logout()
{
    $_SESSION = array();
    session_destroy();
    header('Location: /kanban/index.php');
    exit;
}