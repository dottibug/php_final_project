<?php
require_once '../util/main.php';
require_once 'model/Response.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

class ListServices
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

    // Set up form fields and sanitize user input
    // ------------------------------------------------------------------------------
    private function setupFormFields(Form $form, array $fieldsToExclude)
    {
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                $filteredValue = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $form->addField($key);
                $form->getField($key)->setValue($filteredValue);
            }
        }
    }

    // Get list fields
    // ------------------------------------------------------------------------------
    private function getListFields(Form $form, array $fieldsToExclude)
    {
        $lists = [];
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                $lists[] = $form->getField($key);
            }
        }
        return $lists;
    }

    // Add list
    // ------------------------------------------------------------------------------
    public function addList(Form $form)
    {
        // Set up form fields
        $this->setupFormFields($form, array('action'));

        // Fields array
        $fields = [$this->form->getField('title')];

        // Lists
        $lists = $this->getListFields($form, array('title', 'action'));

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
    }

    // Delete list
    // ------------------------------------------------------------------------------
    public function deleteList(Form $form)
    {
        // Set up form fields
        $this->setupFormFields($form, array('action', 'itemToDelete'));

        // Add to session data (the lists here will only be deleted when the user clicks 'Save')
        $itemToDelete = filter_input(INPUT_POST, 'itemToDelete');
        $_SESSION['listsToDelete'][] = $itemToDelete;

        // Fields array
        $fields = [$this->form->getField('title')];

        // Lists
        $lists = $this->getListFields($form, array('title', 'action', 'itemToDelete',
            $itemToDelete));

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