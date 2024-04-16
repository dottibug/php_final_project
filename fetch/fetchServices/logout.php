<?php
require_once '../util/main.php';

header('Content-Type: application/x-www-form-urlencoded');

// Handle logout (clear session, destroy session, return to index)
// ------------------------------------------------------------------------------
function logout()
{
    // Clear session cookies
    $sessionName = session_name();
    $expire = strtotime('-1 year');
    $params = session_get_cookie_params();
    $path = $params['path'];
    $domain = $params['domain'];
    $secure = $params['secure'];
    $httponly = $params['httponly'];
    setcookie($sessionName, '', $expire, $path, $domain, $secure, $httponly);

    // Clear session data
    $_SESSION = array();

    // Destroy and end session
    session_destroy();

    // Redirect user
    header('Location: /kanban/index.php');
    exit;
}