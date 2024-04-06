import {handleShowAddTaskForm, handleShowBoardMenu} from "../render/forms/formHandlers.js";
import {renderSidebar} from "../render/sidebar/renderSidebar.js";
import {renderBoardLists} from '../render/renderBoardLists.js';

// -----------------------------------------------------------------------------
// EVENT: Fetch requests after document is loaded
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    await fetchBoards();
    await fetchCurrentBoardLists();
});

// -----------------------------------------------------------------------------
// Fetch user boards to render sidebar
// -----------------------------------------------------------------------------
export async function fetchBoards() {
    // Fetch request
    const params = new URLSearchParams(
        {'action': 'fetchBoards'}
    );

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
    if (data.success) {
        const {boards, boardTitle, currentBoardID} = data;

        // Render sidebar
        renderSidebar(boards, currentBoardID);

        // Set main board heading
        document.getElementById('boardTitle').innerText = boardTitle;

        // Add event listener to "Add New Task" button
        const addNewTaskButton = document.getElementById('addNewTaskButton');
        addNewTaskButton.addEventListener('click', handleShowAddTaskForm);

        // Add event listener to board menu
        const boardMenu = document.getElementById("mainBoardHeaderKebab");
        boardMenu.addEventListener('click', handleShowBoardMenu);
    }
}

// -----------------------------------------------------------------------------
// Fetch the lists for the active board
// -----------------------------------------------------------------------------
export async function fetchCurrentBoardLists() {
    // Fetch request
    const params = new URLSearchParams(
        {'action': 'fetchCurrentBoardLists'}
    );

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();
    
    // Rendering
    if (data.success) {
        const {currentBoardLists} = data;
        const lists = Object.values(currentBoardLists[0]['lists']);
        renderBoardLists(lists);
    }
}






