import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";
import {renderCustomSelectOLD} from "../uiElements/renderCustomSelectOLD.js";
import {renderButton} from "../uiElements/renderButton.js";
import {handleAddSubtask} from "./handlersViewTask.js";
import {renderEditTaskSubtasks} from "./renderEditTaskSubtasks.js";

export function renderEditTaskFormOLD(task, lists) {
    console.log('Task: ', task);
    console.log('Lists: ', lists);

    renderLightbox('Edit Task');
    const lightbox = document.getElementById('lightbox');

    // Edit task form
    const editTaskForm = document.createElement('form');
    editTaskForm.id = 'editTaskForm';
    editTaskForm.className = 'lightboxForm';

    // Wrapper <div> for non-dynamic fields
    const taskDetails = document.createElement('div');
    taskDetails.className = 'taskDetails';
    taskDetails.id = 'editTaskDetails';

    // These fields are for the first render
    const fields = [
        {name: 'title', value: task.title, type: 'text'},
        {name: 'description', value: task.description, type: 'textarea'}
    ];

    // Task details form fields (non-dynamic input of title and description)
    renderLightboxFormFields(fields, taskDetails);

    // Move container
    const moveToContainer = document.createElement('div');
    moveToContainer.className = 'moveToContainer';

    // Custom select dropdown
    renderCustomSelectOLD(moveToContainer, 'Move To List', lists, task.listID, task.listTitle);

    // Subtasks
    // Initial subtasks objects for first render
    const subtasks = Object.values(task.subtasks);
    subtasks.forEach(subtask => {
        subtask.name = subtask.subtaskID;
        subtask.value = subtask.description;
    })
    const subtasksWrapper = document.createElement('div');
    subtasksWrapper.id = 'subtasksWrapper';

    renderEditTaskSubtasks(subtasksWrapper, subtasks, false, '', 'editTaskForm');

    // Add subtask <button>
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddSubtask(e));

    // Compose
    lightbox.appendChild(editTaskForm);
    editTaskForm.insertAdjacentElement('afterbegin', taskDetails);
    taskDetails.insertAdjacentElement('afterend', moveToContainer);
    editTaskForm.appendChild(subtasksWrapper);
    subtasksWrapper.insertAdjacentElement('afterend', addSubtaskButton);
}

// EVENT: Delete subtask
function handleDeleteSubtask(e) {
    e.preventDefault();
    const subtaskToDelete = e.target.closest('button').dataset.subtaskName;
}