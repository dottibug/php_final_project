<?php
require_once '../util/main.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

function addList()
{
    try {
        $title = filter_input(INPUT_POST, 'title');

        // Create form
        $Form = new Form();
        $Form->addField('title');
        $Form->getField('title')->setValue($title);

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action') {
                $Form->addField($key);
                $Form->getField($key)->setValue($value);
                $lists[] = $Form->getField($key);
            }
        }

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' =>
            $lists];

        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}