<?php
require_once '../util/main.php';
require_once 'model/Response.php';
require_once 'model/BoardsDB.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

class BoardServices
{
    private $boardsDB, $userID, $form, $validate, $taskListsDB;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        if (!isset($_SESSION['userID'])) {
            $this->userID = null;
        } else {
            $this->userID = $_SESSION['userID'];
        }
        $this->boardsDB = new BoardsDB();
        $this->taskListsDB = new TaskListsDB();
    }

    // Set form
    // ------------------------------------------------------------------------------
    public function setForm(Form $form)
    {
        $this->form = $form;
    }

    // Set validate
    // ------------------------------------------------------------------------------
    public function setValidate(Form $form)
    {
        $this->validate = new Validate($form);
    }

    // Set up form fields with sanitized user input and validate for field errors
    // ------------------------------------------------------------------------------
    private function setupFormFields(Form $form, array $fieldsToExclude)
    {
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                // Sanitize user input
                $filteredValue = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
                $form->addField($key);
                $form->getField($key)->setValue($filteredValue);

                // Set input type
                if ($key == 'description') {
                    $form->getField($key)->setType('textarea');
                } else {
                    $form->getField($key)->setType('text');
                }

                // Validate input
                $this->setValidate($form);
                $this->validate->text($key, $filteredValue, true, 1, 50);

                // Set custom error for subtask field errors
                if ($form->getField($key)->hasError()) {
                    if ($key != 'title') {
                        $form->getField($key)->setError('List names must be 1 to 50 characters long.');
                    }
                } elseif (!$form->getField($key)->hasError()) {
                    // Clear any previous errors if there are no current errors
                    $form->getField($key)->clearError();
                }
            }
        }
    }

    // Get list fields
    // ------------------------------------------------------------------------------
    private function getlistFields(Form $form, array $fieldsToExclude)
    {
        $lists = [];
        foreach ($_POST as $key => $value) {
            if (!in_array($key, $fieldsToExclude)) {
                $lists[] = $form->getField($key);
            }
        }
        return $lists;
    }

    // Update current board ID
    // ------------------------------------------------------------------------------
    public function updateCurrentBoardID()
    {
        if (isset($_POST['newBoardID'])) {
            $newBoardID = filter_input(INPUT_POST, 'newBoardID');
            $_SESSION['currentBoardID'] = $newBoardID;
            Response::sendResponse('true', ['newCurrentBoardID' => $newBoardID]);
        }
    }

    // Fetch boards
    // ------------------------------------------------------------------------------
    public function fetchBoards()
    {
        // Get user boards
        $boards = $this->boardsDB->getBoards($this->userID);

        // Set current board ID to the first user board (if not set yet)
        if (!isset($_SESSION['currentBoardID'])) {
            $firstBoard = $boards[0];
            $firstBoardID = $firstBoard->getBoardID();
            $_SESSION['currentBoardID'] = $firstBoardID;
        }

        // Get title of the current board
        $boardTitle = $this->boardsDB->getBoardTitle($_SESSION['currentBoardID']);

        // Response
        Response::sendResponse(true, ['currentBoardID' => $_SESSION['currentBoardID'],
            'currentBoardTitle' => $boardTitle, 'boards' => $boards]);
    }

    // Fetch current board lists
    // ------------------------------------------------------------------------------
    public function fetchCurrentBoardLists()
    {
        $currentBoardsLists = $this->boardsDB->getBoardDetails($_SESSION['currentBoardID']);
        Response::sendResponse(true, ['currentBoardLists' => $currentBoardsLists[0]]);
    }

    // Create board form
    // ------------------------------------------------------------------------------
    public function showCreateBoardForm(Form $form)
    {
        $form->addField('title');
        $form->getField('title')->setType('text');

        // Fields array
        $fields = [$form->getField('title')];

        // Lists
        $defaultLists = ['list1', 'list2', 'list3'];
        $form->addFields($defaultLists);
        $form->getField('list1')->setValue('todo');
        $form->getField('list2')->setValue('doing');
        $form->getField('list3')->setValue('done');

        $lists = [];
        foreach ($defaultLists as $list) {
            $lists[] = $form->getField($list);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
    }

    // Edit board form
    // ------------------------------------------------------------------------------
    public function showEditBoardForm(Form $form)
    {
        // Board title
        $currentBoardID = $_SESSION['currentBoardID'];
        $boardTitle = $this->boardsDB->getBoardTitle($currentBoardID);

        // Form
        $form->addField('title');
        $form->getField('title')->setType('text');
        $form->getField('title')->setValue($boardTitle);

        // Fields array
        $fields = [$form->getField('title')];

        // Lists
        $_SESSION['listsToDelete'] = [];
        $boardLists = $this->boardsDB->getBoardDetails($currentBoardID)[0]->getLists();

        $lists = [];
        foreach ($boardLists as $list) {
            $listID = $list->getListID();
            $form->addField($listID);
            $form->getField($listID)->setValue($list->getTitle());
            $lists[] = $form->getField($listID);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
    }

    // Save changes to board
    // ------------------------------------------------------------------------------
    public function editBoard(Form $form)
    {
        // Form
        $this->setupFormFields($form, ['action']);

        // Fields array
        $fields = [$form->getField('title')];

        // Lists
        $lists = $this->getListFields($form, ['title', 'action']);

        // Responses
        if ($form->hasErrors()) {
            Response::sendResponse(false, ['fields' => $fields,
                'lists' => $lists], 'Input errors');
        } else {
            // Update the board title
            $title = $form->getField('title')->getValue();
            $currentBoardID = $_SESSION['currentBoardID'];
            $this->boardsDB->updateBoard($currentBoardID, $title);

            // Delete listsToDelete from the database
            $listsToDelete = $_SESSION['listsToDelete'];
            foreach ($listsToDelete as $list) {
                $this->taskListsDB->deleteList($list);
            }

            // Update or add the remaining board lists
            $i = 0;
            foreach ($lists as $list) {
                $listID = $list->getName();
                $listExists = $this->taskListsDB->listExists($listID);

                if ($listExists) {
                    // Update list if it exists in the database already
                    $listValue = $list->getValue();
                    $this->taskListsDB->updateList($listID, $listValue);
                } else {
                    // Assign list color
                    $color = ['#49C4E5', '#8471F2', '#67E2AE', '#FFAFCC', '#FFD166',
                        '#006D77', '#F7A072', '#F07167', '#DD2D4A', '#A3CEF1'];
                    $listColor = $color[$i];

                    // Add list if it doesn't exist yet
                    $listValue = $list->getValue();
                    $this->taskListsDB->addList($currentBoardID, $listValue, $listColor);
                }
                $i++;
            }
            Response::sendResponse(true);
        }
    }

    // Add board
    // ------------------------------------------------------------------------------
    public function addBoard(Form $form)
    {
        // Create form
        $this->setupFormFields($form, ['action']);

        // Fields array
        $fields = [$form->getField('title')];

        // Lists
        $lists = $this->getlistFields($form, ['title', 'action']);

        // Responses
        if ($form->hasErrors()) {
            Response::sendResponse(false, ['fields' => $fields,
                'lists' => $lists], 'Input errors');
        } else {
            // Add the new board and its lists
            $title = $form->getField('title')->getValue();
            $this->boardsDB->addBoard($this->userID, $title);

            // New board ID
            $newBoardID = $this->boardsDB->getBoardID($title);
            $_SESSION['currentBoardID'] = $newBoardID;

            $i = 0;
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action') {

                    // Assign list color
                    $color = ['#49C4E5', '#8471F2', '#67E2AE', '#FFAFCC', '#FFD166',
                        '#006D77', '#F7A072', '#F07167', '#DD2D4A', '#A3CEF1'];
                    $listColor = $color[$i];

                    // Add list to the database
                    $this->taskListsDB->addList($newBoardID, $value, $listColor);
                    $i++;
                }
            }
            Response::sendResponse(true);
        }
    }

    // Show 'Delete Board' warning
    // ------------------------------------------------------------------------------
    public function showDeleteBoardWarning()
    {
        $boardTitle = $this->boardsDB->getBoardTitle($_SESSION['currentBoardID']);
        Response::sendResponse(true, ['boardTitle' => $boardTitle]);
    }

    // Delete board
    // ------------------------------------------------------------------------------
    public function deleteBoard()
    {
        // Delete board
        $this->boardsDB->deleteBoard($_SESSION['currentBoardID']);
        unset($_SESSION['currentBoardID']);
        Response::sendResponse(true);
    }
}