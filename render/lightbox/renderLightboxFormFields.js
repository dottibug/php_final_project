import {renderTextarea} from "../uiElements/renderTextarea.js";
import {renderInput} from "../uiElements/renderInput.js";

export function renderLightboxFormFields(fields, container) {
    fields.forEach(field => {
        // Lightbox field <div>
        const lightboxField = document.createElement('div');
        lightboxField.className = 'lightboxField';
        lightboxField.id = field.name;

        // Label <div>
        const labelContainer = document.createElement('div');
        labelContainer.className = 'labelContainer';

        // Field <label>
        const label = document.createElement('label');
        label.for = field.name;
        label.innerText = field.name;
        labelContainer.appendChild(label);

        // Conditional error <p>
        if (field.hasError) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'fieldError';
            errorMessage.innerText = field.message;
            labelContainer.appendChild(errorMessage);
        }

        // Field input type
        const input = field.type === 'textarea'
            ? renderTextarea('', field.name, field.value)
            : renderInput('text', '', field.name, field.value);

        // Compose field
        container.insertAdjacentElement('beforeend', lightboxField);
        lightboxField.appendChild(labelContainer);
        lightboxField.appendChild(input);
    })
}