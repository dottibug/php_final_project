import {renderForm} from "../../render/forms/renderForm.js";
import {
    fetchData,
    getFormData,
    refreshBoards,
    renderErrors
} from "../../render/forms/formHandlers.js";

// Show 'Create Board' form
// -----------------------------------------------------------------------------------
export async function showCreateBoardForm() {
    // Fetch
    const action = 'showCreateBoardForm';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {fields, lists} = data;
        renderForm('Create New Board', 'createBoard', fields, lists, null);
    }
}

// Add new board
// -----------------------------------------------------------------------------------
export async function addBoard(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addBoard';
    const formData = getFormData();
    const data = await fetchData(action, formData)

    // Render
    if (!data.success) renderErrors('deleteList', data.fields, data.lists, labelText, placeholder);
    if (data.success) await refreshBoards(true);
}

// Delete board
// -----------------------------------------------------------------------------------
export async function deleteBoard() {
    const action = 'deleteBoard';
    const data = await fetchData(action);
    if (data.success) await refreshBoards(true);
}

// Edit board
// -----------------------------------------------------------------------------------
export async function saveBoardChanges(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editBoard';
    const formData = getFormData();
    const data = await fetchData(action, formData);

    // Render
    if (!data.success) renderErrors('deleteList', data.fields, data.lists, labelText, placeholder);
    if (data.success) await refreshBoards(true);
}