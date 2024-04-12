import {renderFormElement} from "../uiElements/renderFormElement.js";
import {renderCheckboxList} from "../uiElements/renderCheckboxList.js";
import {createElement} from "../uiElements/elements.js";


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