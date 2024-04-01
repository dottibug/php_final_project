<?php
require_once '../util/main.php';
require_once 'model/Action.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/BoardsDB.php';
require_once 'model/TaskListsDB.php';

session_start();
header('Content-Type: application/x-www-form-urlencoded');

$action = Action::getAction('createBoardForm');

// Create form
$Form = new Form();

// Add static form fields (user cannot delete these fields)
$Form->addField('title');
$fields = [$Form->getField('title')];


// Controller
switch ($action) {
    case ('createBoardForm'):
        if ($Form) {
            // Default lists to create a new board (these can be edited, added, deleted by user)
            $defaultLists = ['list1', 'list2', 'list3'];
            $Form->addFields($defaultLists);
            $Form->getField('list1')->setValue('todo');
            $Form->getField('list2')->setValue('doing');
            $Form->getField('list3')->setValue('done');

            $lists = [];
            foreach ($defaultLists as $list) {
                $lists[] = $Form->getField($list);
            }

            $response = ['success' => true, 'fields' => $fields, 'lists' => $lists];
            echo json_encode($response);
        } else {
            $response = ['success' => false, 'message' => 'An error occurred creating the form.'];
            echo json_encode($response);
        }
        break;
    case ('deleteList'):
        // Get title and the list user wants to delete from the form
        $listToDelete = filter_input(INPUT_POST, 'listToDelete');
        $title = filter_input(INPUT_POST, 'title');

        try {
            // Update the title value in case the user edited them
            $Form->getField('title')->setValue($title);

            // Create fields array for the response
            $fields = [$Form->getField('title')];

            // Add starting board lists to the Form object and to the lists array for the response
            $lists = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action' && $key != 'listToDelete'
                    && $key != $listToDelete) {
                    $value_f = filter_input(INPUT_POST, $key);
                    $Form->addField($key);
                    $Form->getField($key)->setValue($value_f);
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
    case ('addList') :
        try {
            // Get title from the form
            $title = filter_input(INPUT_POST, 'title');

            // Update the title value in case the user edited it
            $Form->getField('title')->setValue($title);

            // Create fields array for the response
            $fields = [$Form->getField('title')];

            // Add starting board lists to the Form object and to the lists array for the response
            $lists = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action') {
                    $value_f = filter_input(INPUT_POST, $key);
                    $Form->addField($key);
                    $Form->getField($key)->setValue($value_f);
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
    case ('createBoard'):
        // Get userID and currentBoardID from session array
        $userID = $_SESSION['userID'];
        $boardID = $_SESSION['currentBoardID'];

        try {
            // Add boards to database
            $title = filter_input(INPUT_POST, 'title');

            // Update the title value of the Form object
            $Form->getField('title')->setValue($title);

            // Create validation object
            $Validate = new Validate($Form);

            // Validate title
            $Validate->text('title', $title, true, 1, 24);

            // Fields array to send in response
            $fields = [$Form->getField('title')];

            // Add the starting board lists to the Form object for validation
            $lists = [];
            foreach ($_POST as $key => $value) {
                if ($key != 'title' && $key != 'action') {
                    // Get the user input
                    $value_f = filter_input(INPUT_POST, $key);

                    // Add to the Form object
                    $Form->addField($key);
                    $Form->getField($key)->setValue($value_f);

                    // Validate the input
                    $Validate->text($key, $value_f, true, 1, 24);

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
                // Add the new board and its lists
                $BoardsDB = new BoardsDB();
                $BoardsDB->addBoard($userID, $title);

                // Get new board ID
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