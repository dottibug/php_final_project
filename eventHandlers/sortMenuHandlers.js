import {renderSortMenu} from "../render/menus/renderSortMenu.js";
import {fetchData, refreshBoards} from "../render/forms/formHandlers.js";

// Show sort menu on click; hide on mouse leave
// -----------------------------------------------------------------------------------
export function showSortMenu(e) {
    const event = e.type;

    if (event === 'click') {
        const listID = e.target.closest('button').dataset.listId;
        renderSortMenu(listID);
    }

    if (event === 'mouseleave') {
        const sortMenu = e.target;
        sortMenu.remove();
    }
}

// Sort tasks by newest or oldest
// -----------------------------------------------------------------------------------
export async function sortTasks(e) {
    // Fetch
    const action = e.target.dataset.action;
    const listID = e.target.dataset.listId;
    const res = await fetchData(action, {}, {'listID': listID});

    // Render
    if (res.success) await refreshBoards();
}