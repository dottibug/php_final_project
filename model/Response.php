<?php

class Response
{
    // Sets up response for fetch requests
    // -----------------------------------------------------------------------------
    public static function sendResponse($success, $data = [], $message = '')
    {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    // Sets up error responses
    // -----------------------------------------------------------------------------
    public static function sendErrorResponse($error)
    {
        $_SESSION['errorMessage'] = $error;
        header('Content-Type: application/json');
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'error' => $error]);
        $_SESSION['errorMessage'] = $error;
        exit;
    }
}