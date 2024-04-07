import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderForm} from "./renderForm.js";
import {renderFields} from "./renderFields.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {renderBoardMenu} from "../menus/renderBoardMenu.js";
import {renderTaskMenu} from "../menus/renderTaskMenu.js";

// -----------------------------------------------------------------------------
// Re-fetch board data and close the lightbox form
// -----------------------------------------------------------------------------
export async function refreshBoards() {
    await fetchBoards();
    await fetchCurrentBoardLists();
    handleCloseLightbox();
}

// -----------------------------------------------------------------------------
// Task click
// -----------------------------------------------------------------------------
export async function handleTaskClick(e, clickedTask) {
    const {title, taskID} = clickedTask;
    const taskMenu = document.getElementById(`taskMenu${taskID}`);
    const menuButton = e.target.closest('button');

    // Event delegation
    if (!menuButton) {
        // Fetch
        let data;
        const action = e.target.closest('li').dataset['action'];
        if (action === 'editTask') data = await fetchData('editTaskForm', {}, {'taskID': taskID});
        if (action === 'deleteTask') data = await fetchData('deleteTaskWarning', {}, {'taskID': taskID});
        if (action === 'viewTask') data = await fetchData('viewTask', {}, {'taskID': taskID});

        // Render
        if (data.success) {
            const {fields, lists, subtasks, task} = data;
            if (action === 'editTask') renderForm('Edit Task', 'editTask', fields, lists, subtasks, '', task);
            if (action === 'deleteTask') renderForm(title, 'deleteTaskWarning', null, null, null, null, task);
            if (action === 'viewTask') renderForm(title, 'viewTask', fields, lists, subtasks, '', task);
        }
        if (taskMenu) taskMenu.remove(); // Remove task menu from UI
    }

    if (menuButton) {
        if (taskMenu) taskMenu.remove(); // Remove task menu from UI

        else {
            // Remove other task menus before rendering the new task menu
            const taskMenus = document.querySelectorAll('.taskMenu');
            taskMenus.forEach(menu => menu.remove());
            renderTaskMenu(taskID);
        }
    }
}

// -----------------------------------------------------------------------------
// Show 'Create Board' form
// -----------------------------------------------------------------------------
export async function handleShowNewBoardForm() {
    // Fetch
    const action = 'showNewBoardForm';
    const data = await fetchData(action);

    // Render
    if (data.success) renderForm('Create New Board', 'createBoard', data.fields, data.lists, null);
}

// -----------------------------------------------------------------------------
// Add new board
// -----------------------------------------------------------------------------
export async function handleAddBoard(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addBoard';
    const formData = getFormData();
    const data = await fetchData(action, formData)

    // Render
    if (!data.success) renderErrors('deleteList', data.fields, data.lists, labelText, placeholder);
    if (data.success) refreshBoards();
}

// -----------------------------------------------------------------------------
// Render errors
// -----------------------------------------------------------------------------
export function renderErrors(deleteAction, fields, dynamicList, labelText, placeholder) {
    fields.forEach(field => {
        // Render field errors
        if (field.hasError) {
            const fieldsWrapper = document.getElementById('fieldsWrapper');
            fieldsWrapper.remove();

            const newFieldsWrapper = renderFields(fields);
            const form = document.getElementById('form');
            form.insertAdjacentElement('afterbegin', newFieldsWrapper);
        }
    })

    // Render dynamic list errors
    dynamicList.forEach(list => {
        const {message} = list;
        if (list.hasError) {
            const dynamicListWrapper = document.getElementById('dynamicListWrapper');
            dynamicListWrapper.remove();

            const newDynamicListWrapper = renderDynamicList(deleteAction, dynamicList, labelText, placeholder, true, message);
            const buttonsWrapper = document.getElementById('buttonsWrapper');
            buttonsWrapper.insertAdjacentElement('beforebegin', newDynamicListWrapper);
        }
    })
}


// -----------------------------------------------------------------------------
// Edit board
// -----------------------------------------------------------------------------
export async function handleSaveBoardChanges(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editBoard';
    const formData = getFormData();
    const data = await fetchData(action, formData);

    // Render
    if (!data.success) renderErrors('deleteList', data.fields, data.lists, labelText, placeholder);
    if (data.success) refreshBoards();
}


// -----------------------------------------------------------------------------
// Show board menu
// -----------------------------------------------------------------------------
export function handleShowBoardMenu() {
    const boardMenu = document.getElementById('boardMenu');
    if (boardMenu) boardMenu.remove(); // hide board menu
    else renderBoardMenu(); // show board menu
}

// -----------------------------------------------------------------------------
// Show 'Edit Board' form
// -----------------------------------------------------------------------------
export async function handleShowEditBoardForm() {
    // Fetch
    const action = 'editBoardForm';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const boardMenu = document.getElementById('boardMenu');
        if (boardMenu) boardMenu.remove();
        renderForm('Edit Board', 'editBoard', data.fields, data.lists);
    }
}

// -----------------------------------------------------------------------------
// Show 'Delete Board' warning
// -----------------------------------------------------------------------------
export async function handleShowDeleteBoardWarning() {
    // Fetch
    const action = 'deleteBoardWarning';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {boardTitle} = data;

        // Remove the board menu
        const boardMenu = document.getElementById('boardMenu');
        boardMenu.remove();

        renderForm('Delete this board?', 'deleteBoardWarning', null, null, null, boardTitle);
    }

}

// -----------------------------------------------------------------------------
// Delete board
// -----------------------------------------------------------------------------
export async function handleDeleteBoard() {
    const action = 'deleteBoard';
    const data = await fetchData(action);
    if (data.success) refreshBoards();
}

// -----------------------------------------------------------------------------
// Show 'Add Task' form
// -----------------------------------------------------------------------------
export async function handleShowAddTaskForm() {
    const action = 'showAddTaskForm';
    const data = await fetchData(action);
    if (data.success) renderForm('Add Task', 'addTask', data.fields, data.lists, data.subtasks);
}

// -----------------------------------------------------------------------------
// Get form data
// -----------------------------------------------------------------------------
export function getFormData() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    return formData;
}


// -----------------------------------------------------------------------------
// Fetch data
// -----------------------------------------------------------------------------
export async function fetchData(action, formData = {}, otherParams = {}) {
    const params = new URLSearchParams(formData);
    params.append('action', action);

    for (const [key, value] of Object.entries(otherParams)) {
        params.append(key, value);
    }

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    return data;
}