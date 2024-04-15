import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {renderCheckboxList} from "../uiComponents/renderCheckboxList.js";
import {createElement, findElement} from "../uiComponents/elements.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {refresh} from "./formHandlers.js";


// 'Task Details' lightbox
// -----------------------------------------------------------------------------
export function renderTaskDetails(task, subtasks) {
    const {taskID, description} = task;
    const subtasksArray = Object.values(subtasks);

    // Form element
    const form = renderFormElement();

    // Task wrapper
    const taskWrapper = createElement('div', 'taskWrapper', 'taskWrapper');

    // Task description
    const taskDescription = createElement('p', 'taskDescription', 'taskDescription', description);

    // Subtask checkboxes
    const subtaskCheckboxes = renderCheckboxList(subtasksArray, taskID);

    // Compose
    form.appendChild(taskWrapper);
    taskWrapper.appendChild(taskDescription);
    taskWrapper.appendChild(subtaskCheckboxes);

    // Custom close lightbox handler
    const closeLightbox = findElement('iconCloseButton');
    closeLightbox.removeEventListener('click', handleCloseLightbox);
    closeLightbox.addEventListener('click', handleCloseTaskDetails);

    return form;
}

async function handleCloseTaskDetails() {
    await refresh(false, true, true);
}