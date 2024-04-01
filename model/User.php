<?php
// ------------------------------------------------------------------------------
// Represents a user
// ------------------------------------------------------------------------------
class User
{
    private $userID, $username, $email, $password;

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct($userID, $username, $email, $password)
    {
        $this->userID = $userID;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
    }

    // ------------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------------
    public function getUserID()
    {
        return $this->userID;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    // ------------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------------
    public function setUserID($id)
    {
        $this->userID = $id;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }
}


?>