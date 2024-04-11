import {renderForm} from "../render/forms/renderForm.js";
import {
    fetchData,
    getFormData,
    refreshBoards,
    renderErrors
} from "../render/forms/formHandlers.js";
import {renderTaskMenu} from "../render/menus/renderTaskMenu.js";
import {findElement} from "../render/uiElements/findElement.js";

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
    const res = await fetchData('viewTask', {}, {'taskID': taskID});

    console.log('show task res: ', res);

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
    const action = 'showAddTaskForm';
    const res = await fetchData(action);
    const {fields, lists, subtasks} = res.data;
    const options = {
        heading: 'Add Task',
        formName: 'addTask',
        fields,
        lists,
        subtasks,
        selectedItem
    };
    if (res.success) renderForm(options);
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