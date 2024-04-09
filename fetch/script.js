import {
    fetchData,
} from "../render/forms/formHandlers.js";
import {renderSidebar} from "../render/menus/renderSidebar.js";
import {renderBoardLists} from '../render/menus/renderBoardLists.js';
import {showBoardMenu, showEditBoardForm} from "../eventHandlers/menus/boardMenuHandlers.js";
import {showAddTaskForm} from "../eventHandlers/forms/taskHandlers.js";

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
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {boards, boardTitle, currentBoardID} = data;
        renderSidebar(boards, currentBoardID);

        // Set main board heading
        document.getElementById('boardTitle').innerText = boardTitle;

        // 'Add New Task' button event listener
        const addNewTaskButton = document.getElementById('addNewTaskButton');
        addNewTaskButton.addEventListener('click', showAddTaskForm);

        // Board menu event listener
        const boardMenuKebab = document.getElementById("mainBoardHeaderKebab");
        boardMenuKebab.addEventListener('click', (e) => showBoardMenu(e));

        // 'New List' button event listener
        const newListButton = document.getElementById('newListButton');
        newListButton.addEventListener('click', showEditBoardForm);
    }
}

// Fetch lists for the current board
// -----------------------------------------------------------------------------------
export async function fetchCurrentBoardLists() {
    // Fetch
    const action = 'fetchCurrentBoardLists';
    const data = await fetchData(action);

    // Render
    if (data.success) {
        const {currentBoardLists} = data;
        const lists = Object.values(currentBoardLists[0]['lists']);
        renderBoardLists(lists);
    }
}






