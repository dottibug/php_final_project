import {
    fetchData,
} from "../render/forms/formHandlers.js";
import {renderSidebar} from "../render/menus/renderSidebar.js";
import {renderBoardLists} from '../render/lists/renderBoardLists.js';
import {showBoardMenu} from "../eventHandlers/boardMenuHandlers.js";
import {showAddTaskForm} from "../eventHandlers/taskHandlers.js";
import {findElement} from "../render/uiComponents/elements.js";

// Fetch board data after document loads
// -----------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    await fetchBoards();
    await fetchCurrentBoardLists();
});

// Fetch user boards to render sidebar
// -----------------------------------------------------------------------------------
export async function fetchBoards() {
    // Fetch
    const action = 'fetchBoards';
    const res = await fetchData(action);

    // Render
    if (res.success) {
        const {boards, currentBoardID, currentBoardTitle,} = res.data;

        // Sidebar
        renderSidebar(boards, currentBoardID);

        // Set main board heading
        findElement('boardTitle').innerText = currentBoardTitle;

        // Board menu event listener
        const boardMenuKebab = findElement("mainBoardHeaderKebab");
        boardMenuKebab.addEventListener('click', (e) => showBoardMenu(e));
    }
}

// Fetch lists for the current board
// -----------------------------------------------------------------------------------
export async function fetchCurrentBoardLists() {
    // Fetch
    const action = 'fetchCurrentBoardLists';
    const res = await fetchData(action);

    // Render
    if (res.success) {
        const {currentBoardLists} = res.data;
        const lists = Object.values(currentBoardLists.lists);

        // // 'Add New Task' button event listener
        const addNewTaskButton = findElement('addNewTaskButton');
        addNewTaskButton.addEventListener('click', handleShowAddTaskForm);

        renderBoardLists(lists);
    }
}

// Show 'Add Task' form
// -----------------------------------------------------------------------------------
async function handleShowAddTaskForm() {
    await showAddTaskForm();
}





