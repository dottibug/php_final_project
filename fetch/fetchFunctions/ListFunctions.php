<?php
require_once '../util/main.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

class ListFunctions
{
    // Add list
    // ------------------------------------------------------------------------------
    public function addList()
    {
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
    }

    // Delete list
    // ------------------------------------------------------------------------------
    public function deleteList()
    {
        $title = filter_input(INPUT_POST, 'title');
        $itemToDelete = filter_input(INPUT_POST, 'itemToDelete');

        // Add to session data (the lists here will only be deleted when the user clicks 'Save')
        $_SESSION['listsToDelete'][] = $itemToDelete;

        // Create form
        $Form = new Form();
        $Form->addField('title');
        $Form->getField('title')->setValue($title);

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action' && $key != 'itemToDelete' && $key !=
                $itemToDelete) {
                $Form->addField($key);
                $Form->getField($key)->setValue($value);
                $lists[] = $Form->getField($key);
            }
        }

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' =>
            $lists];

        echo json_encode($response);
    }

    // Sort the tasks in a list
    // ------------------------------------------------------------------------------
    public function sortTasks()
    {
        $sortBy = filter_input(INPUT_POST, 'action');
        $listID = filter_input(INPUT_POST, 'listID');
        $_SESSION['sortOrder'][$listID] = $sortBy;

        $response = ['success' => true];
        echo json_encode($response);
    }

}