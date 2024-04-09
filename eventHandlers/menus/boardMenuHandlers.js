import {renderBoardMenu} from "../../render/menus/renderBoardMenu.js";
import {renderForm} from "../../render/forms/renderForm.js";
import {fetchData} from "../../render/forms/formHandlers.js";
import {findElement} from "../../render/uiElements/findElement.js";

// Show board menu on click; hide on mouse leave
// -----------------------------------------------------------------------------------
export function showBoardMenu(e) {
    const event = e.type;

    if (event === 'click') renderBoardMenu();

    if (event === 'mouseleave') {
        const boardMenu = findElement('boardMenu');
        if (boardMenu) boardMenu.remove();
    }
}

// Show 'Edit Board' form
// -----------------------------------------------------------------------------------
export async function showEditBoardForm() {
    // Fetch
    const action = 'editBoardForm';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {fields, lists} = data;
        renderForm('Edit Board', 'editBoard', fields, lists);
    }
}

// Show 'Delete Board' warning lightbox
// -----------------------------------------------------------------------------------
export async function showDeleteBoardWarning() {
    // Fetch
    const action = 'deleteBoardWarning';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {boardTitle} = data;
        renderForm('Delete this board?', 'deleteBoardWarning', null, null, null, boardTitle);
    }
}