import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {renderCheckboxList} from "../uiComponents/renderCheckboxList.js";
import {createElement} from "../uiComponents/elements.js";


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

    return form;
}