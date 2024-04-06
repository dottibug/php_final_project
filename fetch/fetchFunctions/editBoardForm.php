<?php
require_once '../util/main.php';
require_once 'model/Form.php';
require_once 'model/BoardsDB.php';

header('Content-Type: application/x-www-form-urlencoded');

function editBoardForm()
{
    try {
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

        // Response
        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}