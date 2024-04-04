import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";
import {renderCustomSelect} from "../uiElements/renderCustomSelect.js";
import {renderButton, renderXButton} from "../uiElements/renderButton.js";
import {renderSubtasks} from "./renderSubtasks.js";
import {handleAddSubtask, handleAddTask} from "./handlersAddTaskForm.js";

export function renderAddTaskForm(fields, lists, subtasks) {
    // Lightbox
    renderLightbox('Add New Task');
    const lightbox = document.getElementById('lightbox');

    // Add task <form>
    const lightboxForm = document.createElement('form');
    lightboxForm.id = 'lightboxForm';
    lightboxForm.className = 'lightboxForm';

    // Container <div> for non-dynamic fields
    const taskDetails = document.createElement('div');
    taskDetails.className = 'taskDetails';
    taskDetails.id = 'taskDetails';

    // Wrapper for inputs
    const taskInputsContainer = document.createElement('div');
    taskInputsContainer.className = 'taskInputsContainer';
    taskInputsContainer.id = 'taskInputsContainer';

    // Task form fields (non-dynamic fields)
    renderLightboxFormFields(fields, taskInputsContainer);

    // Custom select element
    renderCustomSelect(taskDetails, 'Add To List', lists, lists[0]['listID'], lists[0]['title']);

    // Subtasks
    renderSubtasks(taskDetails, subtasks);

    // Add subtask <button>
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddSubtask(e));
    lightboxForm.appendChild(addSubtaskButton);

    // Create task <button>
    const createTaskButton = renderButton('primary', 'small', 'Create Task', 'createTaskButton', 'submit');
    createTaskButton.addEventListener('click', (e) => handleAddTask(e));
    lightboxForm.appendChild(createTaskButton);

    // Compose
    lightbox.appendChild(lightboxForm);
    lightboxForm.insertAdjacentElement('afterbegin', taskDetails);
    taskDetails.insertAdjacentElement('afterbegin', taskInputsContainer);
}