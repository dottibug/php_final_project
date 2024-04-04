import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderSubtaskCheckboxes} from "./renderSubtaskCheckboxes.js";
import {renderCustomSelect} from "../uiElements/renderCustomSelect.js";

export function renderTaskDetails(task, lists) {
    const {taskID, listID, listTitle, title, description, subtasks} = task;

    console.log('Task: ', task);

    renderLightbox(title);
    const lightbox = document.getElementById('lightbox');

    // Task container
    const taskContainer = document.createElement('div');
    taskContainer.className = 'taskContainer';
    taskContainer.id = 'taskContainer';

    // Task description
    const taskDescription = document.createElement('p');
    taskDescription.className = 'taskDescription';
    taskDescription.id = 'taskDescription';
    taskDescription.innerText = description;

    // Compose
    lightbox.appendChild(taskContainer);
    if (description) {
        taskContainer.appendChild(taskDescription);
    }
    
    // Compose
    renderSubtaskCheckboxes(subtasks, taskID);
}