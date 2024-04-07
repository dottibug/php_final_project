import {
    fetchData,
    handleShowAddTaskForm,
    handleShowBoardMenu, handleShowEditBoardForm
} from "../render/forms/formHandlers.js";
import {renderSidebar} from "../render/menus/renderSidebar.js";
import {renderBoardLists} from '../render/renderBoardLists.js';

// -----------------------------------------------------------------------------
// Fetch requests after document is loaded
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    await fetchBoards();
    await fetchCurrentBoardLists();
});

// -----------------------------------------------------------------------------
// Fetch user boards to render sidebar
// -----------------------------------------------------------------------------
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
        addNewTaskButton.addEventListener('click', handleShowAddTaskForm);

        // Board menu event listener
        const boardMenu = document.getElementById("mainBoardHeaderKebab");
        boardMenu.addEventListener('click', handleShowBoardMenu);

        // 'New List' button event listener
        const newListButton = document.getElementById('newListButton');
        newListButton.addEventListener('click', handleShowEditBoardForm);
    }
}

// -----------------------------------------------------------------------------
// Fetch lists for the current board
// -----------------------------------------------------------------------------
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






