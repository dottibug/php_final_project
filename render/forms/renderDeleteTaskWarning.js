import {renderButton, renderButtonsWrapper} from "../uiElements/renderButton.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {fetchData, refreshBoards} from "./formHandlers.js";
import {renderFormElement} from "../uiElements/renderFormElement.js";
import {createElement} from "../uiElements/createElement.js";
import {deleteTask} from "../../eventHandlers/forms/taskHandlers.js";

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