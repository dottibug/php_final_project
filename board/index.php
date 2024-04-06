<?php
require_once '../util/main.php';

session_start();

// Only allow valid users access to this page
if (!$_SESSION['validUser']) {
    header('Location: ../index.php?action=show_login');
}

include 'mainBoard.php';