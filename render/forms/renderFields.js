import {renderTextarea} from "../uiElements/renderTextarea.js";
import {renderInput} from "../uiElements/renderInput.js";

export function renderFields(fields) {
    const fieldsWrapper = document.createElement('div');
    fieldsWrapper.className = 'fieldsWrapper';
    fieldsWrapper.id = 'fieldsWrapper';

    fields.forEach(field => {
        const {name, hasError, message, type, value} = field;

        // Field wrapper
        const fieldBox = document.createElement('div');
        fieldBox.className = 'fieldBox';
        fieldBox.id = name;

        // Field label
        const labelBox = document.createElement('div');
        labelBox.className = 'labelBox';

        const label = document.createElement('label');
        label.className = 'inputLabel';
        label.for = name;
        label.innerText = name;

        // Input
        const input = type === 'textarea'
            ? renderTextarea(name, value)
            : renderInput(name, value);

        // Compose
        fieldsWrapper.appendChild(fieldBox);
        fieldBox.appendChild(labelBox);
        labelBox.appendChild(label);
        fieldBox.appendChild(input);

        // Field error
        if (hasError) {
            const fieldError = document.createElement('p');
            fieldError.className = 'fieldError';
            fieldError.innerText = message;
            labelBox.appendChild(fieldError);
        }
    })

    return fieldsWrapper;
}