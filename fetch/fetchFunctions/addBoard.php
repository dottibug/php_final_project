<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/BoardsDB.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function addBoard()
{
    try {
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
            $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields,
                'lists' => $lists];
            echo json_encode($response);
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

            // Response
            $response = ['success' => true];
            echo json_encode($response);
        }

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}