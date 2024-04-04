import {renderTaskDetails} from "./renderTaskDetails.js";
import {renderSubtaskCheckboxes} from "./renderSubtaskCheckboxes.js";
import {renderEditTaskForm} from "./renderEditTaskForm.js";
import {renderTaskMenu} from "./renderTaskMenu.js";
import {renderEditTaskSubtasks} from "./renderEditTaskSubtasks.js";

// ------------------------------------
// EVENT: Task click
// ------------------------------------
export function handleTaskClick(e, task, lists) {
    console.log('Handle task click: ');
    const taskID = task.taskID;
    const taskMenu = document.getElementById(`taskMenu${taskID}`);
    const menuButton = e.target.closest('button');

    // Event delegation
    if (!menuButton) {
        const action = e.target.closest('li').dataset['action'];

        // Render edit task form, delete task warning, or task details based on action
        if (action === 'editTask') renderEditTaskForm(task, lists);
        else if (action === 'deleteTask') console.log('show delete task warning'); // TODO
        else renderTaskDetails(task, lists);

        // Remove task menu from UI
        if (taskMenu) taskMenu.remove();
    }

    if (menuButton) {
        if (taskMenu) taskMenu.remove();

        else {
            // Remove other task menus before rendering the new task menu
            const taskMenus = document.querySelectorAll('.taskMenu');
            taskMenus.forEach(menu => menu.remove());
            renderTaskMenu(taskID);
        }
    }
}

// ------------------------------------
// EVENT: Handle subtasks check/uncheck
// ------------------------------------
export async function handleStrikeSubtask(e, taskID) {
    const checkboxID = e.target.id;
    const checked = document.getElementById(checkboxID).checked;

    // Fetch params
    const params = new URLSearchParams({
        'action': 'updateStatus',
        'subtaskID': checkboxID,
        'taskID': taskID,
    })

    if (!checked) {
        // Change status of subtask to unchecked
        params.append('newStatus', 'unchecked');
    } else {
        // Change status of subtask to checked
        params.append('newStatus', 'checked');
    }

    // Fetch init
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/viewTask.php', init);
    const data = await response.json();

    if (data.success) {
        // Re-render the subtasks in the UI
        const subtasksLabel = document.getElementById('subtasksLabel');
        const subtasksCheckboxesContainer = document.getElementById('subtasksCheckboxesContainer');
        subtasksLabel.remove();
        subtasksCheckboxesContainer.remove();
        renderSubtaskCheckboxes(data.subtasks, data.taskID);
    }
}

// EVENT: Show edit task form
export async function handleShowEditTaskForm(e, taskID) {
    console.log(`show edit task form for taskID ${taskID} `);
}

// ------------------------------------
// EVENT: Add subtask
// ------------------------------------
export async function handleAddSubtask(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('editTaskForm');
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
    const response = await fetch('../fetch/editTask.php', init);
    const data = await response.json();

    console.log('response data from add subtask: ', data);

    // Actions on response
    if (data.success) {
        const subtasksContainer = document.getElementById('subtasksContainer');
        subtasksContainer.remove();

        const subtasksWrapper = document.getElementById('subtasksWrapper');
        renderEditTaskSubtasks(subtasksWrapper, data.subtasks, false, '', 'editTaskForm');
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

    const params = new URLSearchParams(formData);
    console.log('params: ', params.toString());

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
    const response = await fetch('../fetch/editTask.php', init);
    const data = await response.json();

    console.log('delete subtask data response: ', data);
    if (data.success) {
        const subtasksContainer = document.getElementById('subtasksContainer');
        subtasksContainer.remove();

        const subtasksWrapper = document.getElementById('subtasksWrapper');
        renderEditTaskSubtasks(subtasksWrapper, data.subtasks, false, '', 'editTaskForm');
    }
}