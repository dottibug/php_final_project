import {renderInput} from "../uiElements/renderInput.js";
import {renderXButton} from "../uiElements/renderButton.js";
import {handleDeleteSubtask} from "./handlersAddTaskForm.js";

export function renderSubtasks(parentElement, subtasks, hasErrors = false, errMsg = '', formId) {
    // Starting empty subtasks
    const subtasksContainer = document.createElement('div');
    subtasksContainer.className = 'subtasksContainer';
    subtasksContainer.id = 'subtasksContainer';

    // Subtasks label container
    const labelContainer = document.createElement('div');
    labelContainer.className = 'labelContainer';

    // Label
    const subtasksLabel = document.createElement('label');
    subtasksLabel.className = 'subtasksLabel';
    subtasksLabel.innerText = 'Subtasks';

    // Compose
    parentElement.appendChild(subtasksContainer);
    subtasksContainer.appendChild(labelContainer);
    labelContainer.appendChild(subtasksLabel);

    // Conditional error <p>
    if (hasErrors) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'fieldError';
        errorMessage.innerText = errMsg;
        labelContainer.appendChild(errorMessage);
    }

    // Input for subtasks
    subtasks.forEach(subtask => {
        const subtaskContainer = document.createElement('div');
        subtaskContainer.className = 'subtask';

        // Input
        const subtaskInput = renderInput('text', 'subtaskInput', subtask.name, subtask.value, 'Add a subtask');

        // Delete subtask <button>
        const deleteSubtaskButton = renderXButton('iconDeleteButton', subtask.name);
        deleteSubtaskButton.dataset['subtaskName'] = subtask.name;
        deleteSubtaskButton.addEventListener('click', (e) => handleDeleteSubtask(e, formId));

        // Compose
        subtasksContainer.appendChild(subtaskContainer);
        subtaskContainer.appendChild(subtaskInput);
        subtaskContainer.appendChild(deleteSubtaskButton);
    })
}