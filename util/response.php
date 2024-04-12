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
}