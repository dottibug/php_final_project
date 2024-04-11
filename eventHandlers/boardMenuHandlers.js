import {renderBoardMenu} from "../render/menus/renderBoardMenu.js";
import {renderForm} from "../render/forms/renderForm.js";
import {fetchData} from "../render/forms/formHandlers.js";
import {removeElement} from "../render/uiElements/removeElement.js";

// Show board menu on click; hide on mouse leave
// -----------------------------------------------------------------------------------
export function showBoardMenu(e) {
    const event = e.type;
    if (event === 'click') renderBoardMenu();
    if (event === 'mouseleave') removeElement('boardMenu');
}

// Show 'Edit Board' form
// -----------------------------------------------------------------------------------
export async function showEditBoardForm() {
    // Fetch
    const action = 'editBoardForm';
    const res = await fetchData(action);

    // Render
    if (res.success) {
        const {fields, lists} = res.data;
        const options = {heading: 'Edit Board', formName: 'editBoard', fields, lists};
        renderForm(options);
    }
}

// Show 'Delete Board' warning lightbox
// -----------------------------------------------------------------------------------
export async function showDeleteBoardWarning() {
    // Fetch
    const action = 'deleteBoardWarning';
    const res = await fetchData(action);

    // Render
    if (res.success) {
        const {boardTitle} = res.data;
        const options = {heading: 'Delete this board?', formName: 'deleteBoardWarning', boardTitle};
        renderForm(options);
    }
}