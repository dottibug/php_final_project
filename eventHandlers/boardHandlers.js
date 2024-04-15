import {renderForm} from "../render/forms/renderForm.js";
import {
    fetchData,
    getFormData, refresh,
    renderErrors
} from "../render/forms/formHandlers.js";

// Show 'Create Board' form
// -----------------------------------------------------------------------------------
export async function showCreateBoardForm() {
    // Fetch
    const action = 'showCreateBoardForm';
    const res = await fetchData(action);

    // Render
    if (res.success) {
        const {fields, lists} = res.data;
        const options = {heading: 'Create New Board', formName: 'createBoard', fields, lists};
        renderForm(options);
    }
}

// Add new board
// -----------------------------------------------------------------------------------
export async function addBoard(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addBoard';
    const formData = getFormData();
    const res = await fetchData(action, formData);

    // Render
    if (!res.success) renderErrors('deleteList', res.data.fields, res.data.lists, labelText, placeholder);
    if (res.success) await refresh(true, true);
}

// Delete board
// -----------------------------------------------------------------------------------
export async function deleteBoard() {
    const action = 'deleteBoard';
    const res = await fetchData(action);
    if (res.success) await refresh(true, true, true);
}

// Edit board
// -----------------------------------------------------------------------------------
export async function saveBoardChanges(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editBoard';
    const formData = getFormData();
    const res = await fetchData(action, formData);

    // Render
    if (!res.success) renderErrors('deleteList', res.data.fields, res.data.lists, labelText, placeholder);
    if (res.success) await refresh(true, true, true);
}