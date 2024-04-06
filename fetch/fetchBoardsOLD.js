import {renderSidebar} from "../render/sidebar/renderSidebar.js";
import {handleShowBoardMenu} from "../render/boardMenu/handlersBoardMenuOLD.js";
// import {handleShowAddTaskForm} from "../render/addTask/handlersAddTaskFormOLD.js";

// FETCH user boards (endpoint: fetchBoards.php) and render them in the sidebar navigation
export async function fetchBoardsOLD() {
    const response = await fetch('../fetch/fetchBoards.php');
    const data = await response.json();

    if (data.success) {
        const {boards, currentBoardID} = data;
        renderSidebar(boards, currentBoardID);
        document.getElementById('boardTitle').innerText = data.boardTitle;

        // Add event listener to "Add New Task" button
        // const addNewTaskButton = document.getElementById('addNewTaskButton');
        // addNewTaskButton.addEventListener('click', handleShowAddTaskForm);

        // Add event listener to board menu
        const boardMenu = document.getElementById("mainBoardHeaderKebab");
        boardMenu.addEventListener('click', handleShowBoardMenu);
    }
}