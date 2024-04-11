<?php
require_once '../util/main.php';
require_once 'model/BoardsDB.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';

header('Content-Type: application/x-www-form-urlencoded');

class BoardFunctions
{
    private $BoardsDB, $userID;

    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
        $this->userID = $_SESSION['userID'];
        $this->BoardsDB = new BoardsDB();
    }

    // Fetch boards
    // ------------------------------------------------------------------------------
    public function fetchBoards()
    {
        // Get user boards
        $boards = $this->BoardsDB->getBoards($this->userID);

        // Set current board ID to the first user board (if not set yet)
        if (!isset($_SESSION['currentBoardID'])) {
            $firstBoard = $boards[0];
            $firstBoardID = $firstBoard->getBoardID();
            $_SESSION['currentBoardID'] = $firstBoardID;
        }

        // Get title of the current board
        $boardTitle = $this->BoardsDB->getBoardTitle($_SESSION['currentBoardID']);

        // Response
        Response::sendResponse(true, ['currentBoardID' => $_SESSION['currentBoardID'],
            'currentBoardTitle' => $boardTitle, 'boards' => $boards]);
    }

    // Fetch current board lists
    // ------------------------------------------------------------------------------
    public function fetchCurrentBoardLists()
    {
        $currentBoardsLists = $this->BoardsDB->getBoardDetails($_SESSION['currentBoardID']);
        Response::sendResponse(true, ['currentBoardLists' => $currentBoardsLists[0]]);
    }

    // Fetch current board lists
    // ------------------------------------------------------------------------------
    public function updateCurrentBoardID()
    {
        if (isset($_POST['newBoardID'])) {
            $newBoardID = filter_input(INPUT_POST, 'newBoardID');
            $_SESSION['currentBoardID'] = $newBoardID;
            Response::sendResponse('true', ['newCurrentBoardID' => $newBoardID]);
        }
    }

    // Create board form
    // ------------------------------------------------------------------------------
    public function showCreateBoardForm()
    {
        // Create form
        $Form = new Form();

        // Form fields
        $Form->addField('title');
        $Form->getField('title')->setType('text');

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $defaultLists = ['list1', 'list2', 'list3'];
        $Form->addFields($defaultLists);
        $Form->getField('list1')->setValue('todo');
        $Form->getField('list2')->setValue('doing');
        $Form->getField('list3')->setValue('done');

        $lists = [];
        foreach ($defaultLists as $list) {
            $lists[] = $Form->getField($list);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
    }

    // Edit board form
    // ------------------------------------------------------------------------------
    public function showEditBoardForm()
    {
        // Create form
        $Form = new Form();

        // Form fields
        $BoardsDB = new BoardsDB();
        $currentBoardID = $_SESSION['currentBoardID'];
        $boardTitle = $BoardsDB->getBoardTitle($currentBoardID);
        $Form->addField('title');
        $Form->getField('title')->setType('text');
        $Form->getField('title')->setValue($boardTitle);

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $_SESSION['listsToDelete'] = [];
        $boardLists = $BoardsDB->getBoardDetails($currentBoardID)[0]->getLists();

        $lists = [];
        foreach ($boardLists as $list) {
            $listID = $list->getListID();
            $Form->addField($listID);
            $Form->getField($listID)->setValue($list->getTitle());
            $lists[] = $Form->getField($listID);
        }

        Response::sendResponse(true, ['fields' => $fields, 'lists' => $lists]);
    }

    // Edit the board
    // ------------------------------------------------------------------------------
    public function editBoard()
    {
        $title = filter_input(INPUT_POST, 'title');

        // Create form
        $Form = new Form();
        $Form->addField('title');
        $Form->getField('title')->setValue($title);
        $Form->getField('title')->setType('text');

        // Validation
        $Validate = new Validate($Form);
        $Validate->text('title', $title, true, 1, 24);

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action') {
                // Add to form
                $Form->addField($key);
                $Form->getField($key)->setValue($value);

                // Validate
                $Validate->text($key, $value, true, 1, 24);

                // Set a custom error message
                if ($Form->getField($key)->hasError()) {
                    $Form->getField($key)->setError('List names must be 1 to 24 characters long.');
                }
                $lists[] = $Form->getField($key);
            }
        }

        // Responses
        if ($Form->hasErrors()) {
            Response::sendResponse(false, ['fields' => $fields,
                'lists' => $lists], 'Input errors');
        } else {
            // Update the board title
            $currentBoardID = $_SESSION['currentBoardID'];
            $BoardsDB = new BoardsDB();
            $BoardsDB->updateBoard($currentBoardID, $title);

            // Delete listsToDelete from the database
            $TaskListsDB = new TaskListsDB();
            $listsToDelete = $_SESSION['listsToDelete'];
            foreach ($listsToDelete as $list) {
                $TaskListsDB->deleteList($list);
            }

            // Update or add the remaining board lists
            $i = 0;
            foreach ($lists as $list) {
                $listID = $list->getName();
                $listExists = $TaskListsDB->listExists($listID);

                if ($listExists) {
                    // Update list if it exists in the database already
                    $listValue = $list->getValue();
                    $TaskListsDB->updateList($listID, $listValue);
                } else {
                    // Assign list color
                    $color = ['#49C4E5', '#8471F2', '#67E2AE', '#FFAFCC', '#FFD166',
                        '#006D77', '#F7A072', '#F07167', '#DD2D4A', '#A3CEF1'];
                    $listColor = $color[$i];

                    // Add list if it doesn't exist yet
                    $listValue = $list->getValue();
                    $TaskListsDB->addList($currentBoardID, $listValue, $listColor);
                }
                $i++;
            }
            Response::sendResponse(true);
        }
    }

    // Show 'Delete Board' warning
    // ------------------------------------------------------------------------------
    public function showDeleteBoardWarning()
    {
        $boardTitle = $this->BoardsDB->getBoardTitle($_SESSION['currentBoardID']);
        Response::sendResponse(true, ['boardTitle' => $boardTitle]);
    }

    // Delete board
    // ------------------------------------------------------------------------------
    public function deleteBoard()
    {
        // Delete board
        $this->BoardsDB->deleteBoard($_SESSION['currentBoardID']);
        unset($_SESSION['currentBoardID']);
        Response::sendResponse(true);
    }

    // Add board
    // ------------------------------------------------------------------------------
    public function addBoard()
    {
        $title = filter_input(INPUT_POST, 'title');

        // Create form
        $Form = new Form();
        $Form->addField('title');
        $Form->getField('title')->setValue($title);
        $Form->getField('title')->setType('text');

        // Validation
        $Validate = new Validate($Form);
        $Validate->text('title', $title, true, 1, 24);

        // Fields array
        $fields = [$Form->getField('title')];

        // Lists
        $lists = [];
        foreach ($_POST as $key => $value) {
            if ($key != 'title' && $key != 'action') {
                // User input
                $value_f = filter_input(INPUT_POST, $key);

                // Add to form
                $Form->addField($key);
                $Form->getField($key)->setValue($value_f);

                // Validate
                $Validate->text($key, $value_f, true, 1, 24);

                // Set a custom error message
                if ($Form->getField($key)->hasError()) {
                    $Form->getField($key)->setError('List names must be 1 to 24 characters long.');
                }

                $lists[] = $Form->getField($key);
            }
        }

        // Responses
        if ($Form->hasErrors()) {
            Response::sendResponse(false, ['fields' => $fields,
                'lists' => $lists], 'Input errors');
        } else {
            // Add the new board and its lists
            $BoardsDB = new BoardsDB();
            $userID = $_SESSION['userID'];
            $BoardsDB->addBoard($userID, $title);

            // New board ID
            $newBoardID = $BoardsDB->getBoardID($title);
            $_SESSION['currentBoardID'] = $newBoardID;

            $i = 0;
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action') {

                    // Assign list color
                    $color = ['#49C4E5', '#8471F2', '#67E2AE', '#FFAFCC', '#FFD166',
                        '#006D77', '#F7A072', '#F07167', '#DD2D4A', '#A3CEF1'];
                    $listColor = $color[$i];

                    // Add list to the database
                    $TaskListsDB = new TaskListsDB();
                    $TaskListsDB->addList($newBoardID, $value, $listColor);
                    $i++;
                }
            }
            Response::sendResponse(true);
        }
    }
}