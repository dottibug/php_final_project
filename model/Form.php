<?php
// Form class. Creates an array of Field objects within a form.
// ------------------------------------------------------------------------------
require_once 'Field.php';

class Form implements JsonSerializable
{
    private $fields = array();
    private $hasErrors = false;

    // Json serializable
    // ------------------------------------------------------------------------------
    public function jsonSerialize(): mixed
    {
        return [
            'fields' => $this->fields,
            'hasErrors' => $this->hasErrors
        ];
    }

    // Add a field to the form
    // ------------------------------------------------------------------------------
    public function addField($name, $message = '')
    {
        $field = new Field($name, $message);
        $this->fields[$name] = $field;
    }

    // Add fields to the form.
    // ------------------------------------------------------------------------------
    public function addFields($fieldNames)
    {
        foreach ($fieldNames as $name) {
            $this->addField($name);
        }
    }

    // Delete a field of the form
    // ------------------------------------------------------------------------------
    public function deleteField($name)
    {
        unset($this->fields[$name]);
    }

    // Get a field by name
    // ------------------------------------------------------------------------------
    public function getField($name)
    {
        return $this->fields[$name];
    }

    // Check if the form has any fields with errors
    // ------------------------------------------------------------------------------
    public function hasErrors()
    {
        // Check each Field object for an error
        foreach ($this->fields as $field) {
            if ($field->hasError()) {
                $this->hasErrors = true;
                return true;
            }
        }
        // Return false if there are no errors
        $this->hasErrors = false;
        return false;
    }
}