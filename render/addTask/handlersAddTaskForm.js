import {renderAddTaskForm} from "./renderAddTaskForm.js";
import {renderSubtasks} from "./renderSubtasks.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";
import {fetchBoards} from "../../fetch/fetchBoards.js";
import {fetchCurrentBoardLists} from "../../fetch/fetchCurrentBoardLists.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";

// ------------------------------------
// EVENT: Show form
// ------------------------------------
export async function handleShowAddTaskForm() {
    // URL encoded params
    const params = new URLSearchParams({'action': 'showAddTaskForm'});

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/addTask.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        renderAddTaskForm(data.fields, data.lists, data.subtasks);
    }
}

// ------------------------------------
// EVENT: Delete subtask
// ------------------------------------
export async function handleDeleteSubtask(e, formId) {
    e.preventDefault();
    const subtaskToDelete = e.target.closest('button').dataset.subtaskName;
    console.log('subtask to delete: ', subtaskToDelete);

    // Get form data
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    // Fetch params
    const params = new URLSearchParams(formData);

    // Get the selected list ID
    const subtaskListID = document.getElementById('customSelectButton').dataset['selectedData'];
    params.append('subtaskToDelete', subtaskToDelete);
    params.append('subtaskListID', subtaskListID);
    params.append('action', 'deleteSubtask');

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/addTask.php', init);
    const data = await response.json();

    if (data.success) {
        const subtasksContainer = document.getElementById('subtasksContainer');
        subtasksContainer.remove();
        const taskDetails = document.getElementById('taskDetails');
        renderSubtasks(taskDetails, data.subtasks, false, '', 'lightboxForm');
    }
}

// ------------------------------------
// EVENT: Add subtask
// ------------------------------------
export async function handleAddSubtask(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('lightboxForm');
    const formData = new FormData(form);

    // Give new input field a temporary name
    const numLists = document.querySelectorAll('.subtaskInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    const tempName = `subtask${numLists + randomNumber}`;

    // Create URL search params
    const params = new URLSearchParams(formData);
    params.append('action', 'addSubtask');
    params.append(tempName, '');

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/addTask.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        const subtasksContainer = document.getElementById('subtasksContainer');
        subtasksContainer.remove();
        const taskDetails = document.getElementById('taskDetails');
        renderSubtasks(taskDetails, data.subtasks, false, '', 'lightboxForm');
    }
}

// ------------------------------------
// EVENT: Add task
// ------------------------------------
export async function handleAddTask(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('lightboxForm');
    const formData = new FormData(form);

    // Fetch params
    const params = new URLSearchParams(formData);

    // Get the selected list ID
    const listID = document.getElementById('customSelectButton').dataset['selectedData'];
    params.append('listID', listID);
    params.append('action', 'addTask');

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/addTask.php', init);
    const data = await response.json();

    if (!data.success) {
        // If error is in the fields array, re-render the field inputs
        data.fields.forEach((field) => {
            if (field.hasError) {
                const tasksInputContainer = document.getElementById('taskInputsContainer');
                tasksInputContainer.innerHTML = '';
                renderLightboxFormFields(data.fields, tasksInputContainer);
            }
        })

        // If error in the subtasks array, re-render the subtasks
        data.subtasks.forEach((subtask) => {
            if (subtask.hasError) {
                const taskDetails = document.getElementById('taskDetails');
                const subtasksContainer = document.getElementById('subtasksContainer');
                subtasksContainer.remove();
                renderSubtasks(taskDetails, data.subtasks, true, subtask.message, 'lightboxForm');
            }
        })
    }

    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }

}