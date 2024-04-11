<?php
require_once '../util/main.php';
require_once '../util/response.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

class ListFunctions
{
    private $form;


    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
    }

    // Set form
    // ------------------------------------------------------------------------------
    public function setForm(Form $form)
    {
        $this->form = $form;
    }

    // Add list
    // ------------------------------------------------------------------------------
    public function addList()
    {
        $title = filter_input(INPUT_POST, 'title');

        // Create form
        $this->form->addField('title');
        $this->form->getField('title')->setValue($title);

        // Fields array
        $fields = [$this->form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action') {
                $this->form->addField($key);
                $this->form->getField($key)->setValue($value);
                $lists[] = $this->form->getField($key);
            }
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
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
        $this->form->addField('title');
        $this->form->getField('title')->setValue($title);

        // Fields array
        $fields = [$this->form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action' && $key != 'itemToDelete' && $key !=
                $itemToDelete) {
                $this->form->addField($key);
                $this->form->getField($key)->setValue($value);
                $lists[] = $this->form->getField($key);
            }
        }
        Response::sendResponse(true, ['fields' => $fields, 'lists' =>
            $lists]);
    }

    // Sort the tasks in a list
    // ------------------------------------------------------------------------------
    public function sortTasks()
    {
        $sortBy = filter_input(INPUT_POST, 'action');
        $listID = filter_input(INPUT_POST, 'listID');
        $_SESSION['sortOrder'][$listID] = $sortBy;
        Response::sendResponse(true);
    }

}