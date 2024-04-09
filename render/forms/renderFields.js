import {renderTextarea} from "../uiElements/renderTextarea.js";
import {renderInput} from "../uiElements/renderInput.js";
import {createElement} from "../uiElements/createElement.js";

export function renderFields(fields) {
    const fieldsWrapper = createElement('div', 'fieldsWrapper', 'fieldsWrapper');

    fields.forEach(field => {
        const {name, hasError, message, type, value} = field;

        // Field wrapper
        const fieldBox = createElement('div', 'fieldBox', name);

        // Field label
        const labelBox = createElement('div', 'labelBox');
        const label = createElement('label', 'inputLabel', '', name);
        label.for = name;

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
            const fieldError = createElement('div', 'fieldError', '', message);
            labelBox.appendChild(fieldError);
        }
    })

    return fieldsWrapper;
}