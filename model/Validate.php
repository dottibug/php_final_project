<?php
// ------------------------------------------------------------------------------
// Data validation for forms
// ------------------------------------------------------------------------------
class Validate
{
    private $form; // the form to validate

    // ------------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------------
    public function __construct($form)
    {
        $this->form = $form;
    }

    // ------------------------------------------------------------------------------
    // Validate text for length and required status.
    // Defaults: min: 1, max: 50, required: true
    // ------------------------------------------------------------------------------
    public function text($fieldName, $fieldValue, $required = true, $min = 1, $max = 50)
    {
        // Get the Field object
        $Field = $this->form->getField($fieldName);

        // Check if the field is required
        if (!$required) {
            if ((empty($fieldValue)) || strlen(trim($fieldValue)) === 0) {
                $Field->clearError();
                return;
            } elseif (strlen(trim($fieldValue)) > $max) {
                $message = "Max $max characters";
                $Field->setError($message);
                return;
            }
        }

        // Handle field errors
        if (empty($fieldValue) || strlen(trim($fieldValue)) === 0) {
            $Field->setError('Required');
        } elseif (strlen(trim($fieldValue)) < $min || strlen(trim($fieldValue)) > $max) {
            $message = "Must be $min to $max characters";
            $Field->setError($message);
        } else {
            $Field->clearError(); // no errors
        }
    }
}
