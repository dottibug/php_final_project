<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/Validate.php';
require_once 'model/BoardsDB.php';
require_once 'model/TaskListsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function editBoard()
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
            $response = ['success' => false, 'message' => 'input errors', 'fields' => $fields,
                'lists' => $lists];
            echo json_encode($response);
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
            // Response
            $response = ['success' => true];
            echo json_encode($response);
        }

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}