import {renderForm} from "../render/forms/renderForm.js";
import {
    fetchData,
    getFormData,
    refreshBoards,
    renderErrors
} from "../render/forms/formHandlers.js";
import {renderTaskMenu} from "../render/menus/renderTaskMenu.js";
import {findElement} from "../render/uiComponents/elements.js";

// Click a task
// -----------------------------------------------------------------------------------
export async function handleTaskClick(e) {
    // Get the html tag clicked
    const targetTag = e.target.closest('button')
        ? e.target.closest('button').tagName
        : e.target.closest('li').tagName;

    // If html tag is a button, render the task menu
    if (targetTag === 'BUTTON') {
        const taskID = e.target.closest('button').dataset.taskId;
        renderTaskMenu(taskID);
    }

    // If html tag is li, render the task details
    if (targetTag === 'LI') {
        const taskID = e.target.closest('li').dataset.taskId;
        const taskTitle = e.target.closest('li').dataset.taskTitle;
        await showTaskDetails(taskID, taskTitle);
    }
}

// Show task details
// -----------------------------------------------------------------------------------
export async function showTaskDetails(taskID, title) {
    // Fetch
    const res = await fetchData('viewTask', {}, {'taskID': taskID});

    // Render
    if (res.success) {
        const {subtasks, task} = res.data;
        const options = {
            heading: title,
            formName: 'viewTask',
            subtasks,
            task,
            refreshOnClose: true
        };
        renderForm(options);
    }
}

// Show 'Add Task' form
// -----------------------------------------------------------------------------------
export async function showAddTaskForm(selectedItem = '') {
    // Fetch
    const action = 'showAddTaskForm';
    const res = await fetchData(action);

    // Render form
    if (res.success) {
        const {fields, lists, subtasks} = res.data;
        const options = {
            heading: 'Add Task',
            formName: 'addTask',
            fields,
            lists,
            subtasks,
            selectedItem
        };

        renderForm(options);
    }
}

// Add task to list
// -----------------------------------------------------------------------------------
export async function addTask(e, listLabel, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addTask';
    const formData = getFormData();
    const listID = findElement('dropdownButton').dataset.selectedId;
    const res = await fetchData(action, formData, {'listID': listID});

    // Render
    if (!res.success) renderErrors('deleteSubtask', res.data.fields, res.data.subtasks, listLabel, placeholder);
    if (res.success) await refreshBoards(true);
}

// Save changes to task
// -----------------------------------------------------------------------------------
export async function saveTaskChanges(e, taskID, listLabel, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editTask';
    const formData = getFormData();
    const listID = findElement('dropdownButton').dataset.selectedId;
    const res = await fetchData(action, formData, {'taskID': taskID, 'listID': listID});

    // Render
    if (!res.success) renderErrors('deleteSubtask', res.data.fields, res.data.subtasks, listLabel, placeholder);
    if (res.success) await refreshBoards(true);
}

// Delete task
// -----------------------------------------------------------------------------------
export async function deleteTask(e, taskID) {
    e.preventDefault();

    // Fetch
    const action = 'deleteTask';
    const res = await fetchData(action, {}, {'taskID': taskID});

    // Render
    if (res.success) await refreshBoards(true);
}