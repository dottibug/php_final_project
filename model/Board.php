<?php
// ------------------------------------------------------------------------------
// Represents a board
// ------------------------------------------------------------------------------
require_once 'Database.php';

class Board implements JsonSerializable
{
    private $index, $boardID, $userID, $title, $lists = [];

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct()
    {
    }

    // ------------------------------------------------------------------------------
    // Serialized json
    // ------------------------------------------------------------------------------
    public function jsonSerialize(): mixed
    {
        return array_filter(
            [
                'index' => $this->index,
                'boardID' => $this->boardID,
                'userID' => $this->userID,
                'title' => $this->title,
                'lists' => $this->lists,
            ],
            function ($value) {
                return !is_null($value);
            }
        );
    }

    // ------------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------------
    public function getIndex()
    {
        return $this->index;
    }

    public function getBoardID()
    {
        return $this->boardID;
    }

    public function getUserID()
    {
        return $this->userID;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getLists()
    {
        return $this->lists;
    }

    // ------------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------------
    public function setIndex($index)
    {
        $this->index = $index;
    }

    public function setBoardID($id)
    {
        $this->boardID = $id;
    }

    public function setUserID($id)
    {
        $this->userID = $id;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function setLists($lists)
    {
        $this->lists = $lists;
    }

    public function addList($list)
    {
        $this->lists[] = $list;
    }
}