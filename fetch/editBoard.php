<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/BoardsDB.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/TaskListsDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

// Get action
$action = Action::getAction('showEditBoardForm');

// Instantiate classes
$BoardsDB = new BoardsDB();

// Current board
$currentBoardID = $_SESSION['currentBoardID'];

// Create form
$Form = new Form();

// Add static form fields (user cannot delete these fields)
$Form->addField('title');

if (!$_SESSION['listsToDelete']) {
    $_SESSION['listsToDelete'] = [];
}

// Controller
switch ($action) {
    case ('showEditBoardForm'):
        // Empty $_SESSION['listsToDelete']
        $_SESSION['listsToDelete'] = [];

        // Get and set the board title
        $boardTitle = $BoardsDB->getBoardTitle($currentBoardID);
        $Form->addField('title');
        $Form->getField('title')->setValue($boardTitle);

        // Field array for response
        $fields = [$Form->getField('title')];

        // Get the board details
        $currentBoardsLists = $BoardsDB->getBoardDetails($currentBoardID)[0]->getLists();

        // Add lists to Form object
        $lists = [];
        foreach ($currentBoardsLists as $list) {
            $listID = $list->getListID();
            $Form->addField($listID);
            $Form->getField($listID)->setValue($list->getTitle());
            $lists[] = $Form->getField($listID);
        }

        // Response
        $response = ['success' => true, 'lists' => $lists, 'fields' => $fields];
        echo json_encode($response);
        break;
    case ('addList'):
        try {
            // Get title from the form
            $title = filter_input(INPUT_POST, 'title');

            // Update title value in case the user edited it
            $Form->getField('title')->setValue($title);

            // Create fields array for the response
            $fields = [$Form->getField('title')];

            // Add board lists to the Form object and to the lists array
            $lists = [];
            foreach ($_POST as $key => $value) {

                if ($key != 'title' && $key != 'action') {
                    $Form->addField($key);
                    $Form->getField($key)->setValue($value);
                    $lists[] = $Form->getField($key);
                }
            }

            // Response
            $response = $response = ['success' => true, 'fields' => $fields, 'lists' =>
                $lists];
            echo json_encode($response);
        } catch (Exception $e) {
            $response = ['success' => false, 'message' => $e->getMessage()];
            echo json_encode($response);
        }
        break;
    case ('deleteList'):
        // Get title and the list user wants to delete from the form
        $listToDelete = filter_input(INPUT_POST, 'listToDelete');
        $title = filter_input(INPUT_POST, 'title');

        // Add listToDelete to session data. The list(s) will only be deleted from the database if
        // the user clicks 'Save Changes'
        $_SESSION['listsToDelete'][] = $listToDelete;

        try {
            // Update the title value in case the user edited them
            $Form->getField('title')->setValue($title);

            // Create fields array for the response
            $fields = [$Form->getField('title')];

            // Add board lists to the Form object and to the lists array for the response
            $lists = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action' && $key != 'listToDelete'
                    && $key != $listToDelete) {
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
        break;
    case ('saveChanges');
        try {
            // Get the title
            $title = filter_input(INPUT_POST, 'title');

            // Update the title value of the Form object
            $Form->getField('title')->setValue($title);

            // Create validation object
            $Validate = new Validate($Form);

            // Validate title
            $Validate->text('title', $title, true, 1, 24);

            // Fields array to send in response
            $fields = [$Form->getField('title')];

            // Add the board lists to the Form object for validation
            $lists = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action') {
                    // Add to the Form object
                    $Form->addField($key);
                    $Form->getField($key)->setValue($value);

                    // Validate the input
                    $Validate->text($key, $value, true, 1, 24);

                    // Set a custom error message if the input error is 'Required'
                    if ($Form->getField($key)->hasError()) {
                        $Form->getField($key)->setError('List names must be 1 to 24 characters long.');
                    }

                    // Add to lists array to send in response
                    $lists[] = $Form->getField($key);
                }
            }

            // Responses
            if ($Form->hasErrors()) {
                $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields,
                    'lists' => $lists];
                echo json_encode($response);
            } else {
                // Update the board title
                $BoardsDB->updateBoard($currentBoardID, $title);

                // Update the board lists
                $TaskListsDB = new TaskListsDB();

                // Delete listsToDelete from the database
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
                // Response
                $response = ['success' => true];
                echo json_encode($response);
            }
        } catch (Exception $e) {
            $response = ['success' => false];
            echo json_encode($response);
        }
        break;
}