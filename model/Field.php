<?php
// ------------------------------------------------------------------------------
// Represents a form field. Message parameter can be used for field errors or
// tooltips. Used by the Form class to create an array of fields in a specific form.
// ------------------------------------------------------------------------------
class Field implements JsonSerializable
{
    private $name, $message, $value, $type;
    private $hasError = false;

    // Field constructor
    // ------------------------------------------------------------------------------
    public function __construct($name, $message = '')
    {
        $this->name = $name;
        $this->message = $message;
    }

    // Json serializable
    // ------------------------------------------------------------------------------
    public function jsonSerialize(): mixed
    {
        return [
            'type' => $this->type,
            'name' => $this->name,
            'value' => $this->value,
            'message' => $this->message,
            'hasError' => $this->hasError
        ];
    }

    // Get the field's name
    // ------------------------------------------------------------------------------
    public function getName()
    {
        return $this->name;
    }

    // Set value for the field
    // ------------------------------------------------------------------------------
    public function getValue()
    {
        return $this->value;
    }

    // Get the field's message
    // ------------------------------------------------------------------------------
    public function getMessage()
    {
        return $this->message;
    }

    // Get the field's error status
    // ------------------------------------------------------------------------------
    public function hasError()
    {
        return $this->hasError;
    }

    // Get type
    // ------------------------------------------------------------------------------
    public function getType()
    {
        return $this->type;
    }

    // Set name for the field
    // ------------------------------------------------------------------------------
    public function setName($name)
    {
        $this->name = $name;
    }

    // Set value for the field
    // ------------------------------------------------------------------------------
    public function setValue($value)
    {
        $this->value = $value;
    }

    // Set an error message for the field
    // ------------------------------------------------------------------------------
    public function setError($message)
    {
        $this->hasError = true;
        $this->message = $message;
    }

    // Clear the field's error message
    // ------------------------------------------------------------------------------
    public function clearError()
    {
        $this->hasError = false;
        $this->message = '';
    }

    // Set type
    // ------------------------------------------------------------------------------
    public function setType($type)
    {
        $this->type = $type;
    }
}
