import {renderForm} from "../../render/forms/renderForm.js";
import {
    fetchData,
    getFormData,
    refreshBoards,
    renderErrors
} from "../../render/forms/formHandlers.js";
import {renderTaskMenu} from "../../render/menus/renderTaskMenu.js";
import {findElement} from "../../render/uiElements/findElement.js";

// Click a task
// -----------------------------------------------------------------------------------
export async function handleTaskClick(e) {

    const targetTag = e.target.closest('button')
        ? e.target.closest('button').tagName
        : e.target.closest('li').tagName;

    if (targetTag === 'BUTTON') {
        const taskID = e.target.closest('button').dataset.taskId;
        renderTaskMenu(taskID);
    }

    if (targetTag === 'LI') {
        const taskID = e.target.closest('li').dataset.taskId;
        const taskTitle = e.target.closest('li').dataset.taskTitle;
        await showTaskDetails(taskID, taskTitle);
    }
}

// Show task details
// -----------------------------------------------------------------------------------
export async function showTaskDetails(taskID, title) {
    const data = await fetchData('viewTask', {}, {'taskID': taskID});

    if (data.success) {
        const {fields, lists, subtasks, task} = data;
        renderForm(title, 'viewTask', fields, lists, subtasks, '', task);
    }
}

// Show 'Add Task' form
// -----------------------------------------------------------------------------------
export async function showAddTaskForm() {
    const action = 'showAddTaskForm';
    const data = await fetchData(action);
    if (data.success) renderForm('Add Task', 'addTask', data.fields, data.lists, data.subtasks);
}

// Add task to list
// -----------------------------------------------------------------------------------
export async function addTask(e, listLabel, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addTask';
    const formData = getFormData();
    const listID = findElement('dropdownButton').dataset.selectedId;
    const data = await fetchData(action, formData, {'listID': listID});

    // Render
    if (!data.success) renderErrors('deleteSubtask', data.fields, data.subtasks, listLabel, placeholder);
    if (data.success) await refreshBoards(true);
}

// Save changes to task
// -----------------------------------------------------------------------------------
export async function saveTaskChanges(e, taskID, listLabel, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editTask';
    const formData = getFormData();
    const listID = findElement('dropdownButton').dataset.selectedId;
    const data = await fetchData(action, formData, {'taskID': taskID, 'listID': listID});

    // Render
    if (!data.success) renderErrors('deleteSubtask', data.fields, data.subtasks, listLabel, placeholder);
    if (data.success) await refreshBoards(true);
}

// Delete task
// -----------------------------------------------------------------------------------
export async function deleteTask(e, taskID) {
    e.preventDefault();

    // Fetch
    const action = 'deleteTask';
    const data = await fetchData(action, {}, {'taskID': taskID});

    // Render
    if (data.success) await refreshBoards(true);
}