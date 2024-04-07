import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderForm} from "./renderForm.js";
import {renderFields} from "./renderFields.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {renderBoardMenu} from "../menus/renderBoardMenu.js";
import {renderTaskMenu} from "../menus/renderTaskMenu.js";

// -----------------------------------------------------------------------------
// Task click
// -----------------------------------------------------------------------------
export async function handleTaskClick(e, clickedTask) {
    const {title, taskID} = clickedTask;
    const taskMenu = document.getElementById(`taskMenu${taskID}`);
    const menuButton = e.target.closest('button');

    // Event delegation
    if (!menuButton) {
        const action = e.target.closest('li').dataset['action'];
        const params = new URLSearchParams({'taskID': taskID});
        if (action === 'editTask') params.append('action', 'editTaskForm');
        if (action === 'deleteTask') params.append('action', 'deleteTaskWarning');
        if (action === 'viewTask') params.append('action', 'viewTask');

        const fetchOptions = {
            method: 'POST',
            body: params
        }

        const response = await fetch('../fetch/fetchController.php', fetchOptions);
        const data = await response.json();

        if (data.success) {
            const {fields, lists, subtasks, task} = data;
            if (action === 'editTask') renderForm('Edit Task', 'editTask', fields, lists, subtasks, '', task);
            if (action === 'deleteTask') renderForm(title, 'deleteTaskWarning', null, null, null, null, task);
            if (action === 'viewTask') renderForm(title, 'viewTask', fields, lists, subtasks, '', task);
        }

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

// -----------------------------------------------------------------------------
// Show 'Create Board' form
// -----------------------------------------------------------------------------
export async function handleShowNewBoardForm() {
    const params = new URLSearchParams({'action': 'showNewBoardForm'});

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (data.success) {
        const {fields, lists} = data;
        renderForm('Create New Board', 'createBoard', fields, lists, null);
    }
}

// -----------------------------------------------------------------------------
// Add new board
// -----------------------------------------------------------------------------
export async function handleAddBoard(e, labelText, placeholder) {
    e.preventDefault();

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const params = new URLSearchParams(formData);
    params.append('action', 'addBoard');

    // Fetch
    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (!data.success) {
        const {fields, lists} = data;
        renderErrors('deleteList', fields, lists, labelText, placeholder);
    }

    // Re-fetch updated lists, tasks, and subtasks
    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
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

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const params = new URLSearchParams(formData);
    params.append('action', 'editBoard');

    const fetchOptions = {
        method: 'POST',
        body: params,
    }

    // Fetch
    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (!data.success) {
        const {fields, lists} = data;
        renderErrors('deleteList', fields, lists, labelText, placeholder);
    }

    // Re-fetch updated lists, tasks, and subtasks
    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }

}


// -----------------------------------------------------------------------------
// Show board menu
// -----------------------------------------------------------------------------
export function handleShowBoardMenu() {
    const boardMenu = document.getElementById('boardMenu');

    // Hide board menu
    if (boardMenu) boardMenu.remove();

    // Show board menu
    else renderBoardMenu();
}

// -----------------------------------------------------------------------------
// Show 'Edit Board' form
// -----------------------------------------------------------------------------
export async function handleShowEditBoardForm() {
    const params = new URLSearchParams({
        'action': 'editBoardForm'
    });

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (data.success) {
        const boardMenu = document.getElementById('boardMenu');
        boardMenu.remove();

        const {fields, lists} = data;
        renderForm('Edit Board', 'editBoard', fields, lists);
    }

}

// -----------------------------------------------------------------------------
// Show 'Delete Board' warning
// -----------------------------------------------------------------------------
export async function handleShowDeleteBoardWarning() {
    const params = new URLSearchParams({
        'action': 'deleteBoardWarning'
    });

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

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
    const params = new URLSearchParams({'action': 'deleteBoard'});

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}

//////////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// Add list
// -----------------------------------------------------------------------------
export async function handleAddList(e, labelText, placeholder) {
    e.preventDefault();

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Temporary name for new input field
    const numLists = document.querySelectorAll('.dynamicListInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    const tempName = `list${numLists + randomNumber}`;

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('action', 'addList');
    params.append(tempName, '');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (data.success) {
        const {lists} = data;

        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(lists, labelText, deleteList, placeholder);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }
}

// -----------------------------------------------------------------------------
// Delete list
// -----------------------------------------------------------------------------
export async function deleteList(itemToDelete, labelText, placeholder) {
    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('listToDelete', itemToDelete);
    params.append('action', 'deleteList');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    console.log('delete list data: ', data);
    // Rendering
    if (data.success) {
        const {lists} = data;

        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(lists, labelText, deleteSubtask, placeholder);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }

}

// -----------------------------------------------------------------------------
// Show 'Add Task' form
// -----------------------------------------------------------------------------
export async function handleShowAddTaskForm() {
    // Fetch
    const params = new URLSearchParams({'action': 'showAddTaskForm'});

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (data.success) {
        const {fields, lists, subtasks} = data;
        renderForm('Add Task', 'addTask', fields, lists, subtasks);
    }
}

// -----------------------------------------------------------------------------
// Add subtask
// -----------------------------------------------------------------------------
export async function handleAddSubtask(e, labelText, placeholder) {
    e.preventDefault();

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Temporary name for new input field
    const numLists = document.querySelectorAll('.dynamicListInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    const tempName = `subtask${numLists + randomNumber}`;

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('action', 'addSubtask');
    params.append(tempName, '');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (data.success) {
        const {subtasks} = data;

        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(subtasks, labelText, deleteSubtask, placeholder);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }
}

// -----------------------------------------------------------------------------
// Delete subtask
// -----------------------------------------------------------------------------
export async function deleteSubtask(itemToDelete, labelText, placeholder) {
    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('subtaskToDelete', itemToDelete);
    params.append('action', 'deleteSubtask');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (data.success) {
        const {subtasks} = data;

        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(subtasks, labelText, deleteSubtask, placeholder);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }
}