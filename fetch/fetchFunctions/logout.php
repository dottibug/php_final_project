<?php
require_once '../util/main.php';

header('Content-Type: application/x-www-form-urlencoded');

function logout()
{
    $_SESSION = array();
    session_destroy();
    header('Location: ../index.php');
    exit;
}