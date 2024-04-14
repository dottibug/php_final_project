import {renderButton, renderButtonsWrapper} from "../uiComponents/renderButton.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {createElement} from "../uiComponents/elements.js";
import {deleteTask} from "../../eventHandlers/taskHandlers.js";

// 'Delete Task' warning
// -----------------------------------------------------------------------------
export function renderDeleteTaskWarning(task) {
    const {title, taskID} = task;

    // Form element
    const form = renderFormElement();

    // Message
    const warningMessage = createElement('p', 'warningMessage', 'warningMessage');
    warningMessage.innerHTML = `Are you sure you want to delete <span class="warningMessageSpan">${title}</span>? This will delete the task and its subtasks.`;

    // Buttons
    const buttonsWrapper = renderButtonsWrapper('buttonsWrapperWarning', 'buttonsWrapperWarning');

    // Delete button
    const deleteBoardButton = renderButton('danger', 'small', 'Delete', 'deleteBoardButton', 'submit');
    deleteBoardButton.addEventListener('click', (e) => deleteTask(e, taskID));

    // Cancel button
    const cancelButton = renderButton('secondary', 'small', 'Cancel', 'cancelDeleteBoardButton', 'submit');
    cancelButton.addEventListener('click', handleCloseLightbox);

    // Compose
    form.appendChild(warningMessage);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(deleteBoardButton);
    buttonsWrapper.appendChild(cancelButton);

    return form;
}