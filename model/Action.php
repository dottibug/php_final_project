<?php

class Action
{
    // Get action
    // ------------------------------------------------------------------------------
    public static function getAction($defaultAction)
    {
        $action = filter_input(INPUT_POST, 'action');
        if ($action === NULL) {
            $action = filter_input(INPUT_GET, 'action');
            if ($action === NULL) {
                $action = $defaultAction;
            }
        }
        return $action;
    }
}