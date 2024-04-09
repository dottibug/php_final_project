<?php
require_once '../util/main.php';
require_once 'model/Form.php';

header('Content-Type: application/x-www-form-urlencoded');

function createBoardForm()
{
    try {
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

        $response = ['success' => true, 'fields' => $fields, 'lists' => $lists];
        echo json_encode($response);

    } catch (Exception $e) {
        $response = ['success' => false, 'message' => $e->getMessage()];
        echo json_encode($response);
    }
}