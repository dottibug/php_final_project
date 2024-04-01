import {fetchBoards} from '../fetch/fetchBoards.js';
import {fetchCurrentBoardLists} from "../fetch/fetchCurrentBoardLists.js";
import {handleShowCreateBoardForm} from "../fetch/createBoard.js";

// EVENT HANDLER: Select new board in sidebar
async function handleBoardClick(boardID) {
    const init = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `currentBoardID=${encodeURIComponent(boardID)}`,
    }

    const response = await fetch('../fetch/setCurrentBoardID.php', init);
    const data = await response.json();

    // Re-fetch boards and current board lists
    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
    }
}

// RENDER SIDEBAR
export function renderSidebar(boards, currentBoardID) {
    // Sidebar navigation
    const boardsList = document.getElementById('boards');

    // Clear previous boards from sidebar
    boards.forEach(board => {
        const {boardID} = board;
        const boardElement = document.getElementById(boardID);
        if (boardElement !== null) {
            boardElement.remove();
        }
    });

    const createBoardButton = document.getElementById('createNewBoard');

    // Create new sidebar boards
    boards.forEach(board => {
        const {boardID, title} = board;

        // Board <li> element
        const boardElement = document.createElement('li');
        boardElement.className = boardID === parseInt(currentBoardID) ? 'board current' : 'board';
        boardElement.id = boardID;
        boardElement.dataset['boardId'] = boardID;
        boardElement.addEventListener('click', () => handleBoardClick(boardID));

        // Board icon <img> element
        const imageElement = document.createElement('img');
        imageElement.src = boardID === parseInt(currentBoardID) ? '../images/iconBoardWhite.svg' : '../images/iconBoardGray.svg';
        imageElement.className = 'iconBoard';

        // Board title <span> element
        const spanElement = document.createElement('span');
        spanElement.className = 'boardLink';
        spanElement.innerText = title;

        // Compose
        createBoardButton.insertAdjacentElement('beforebegin', boardElement);
        boardElement.appendChild(imageElement);
        boardElement.appendChild(spanElement);

    });

    // Add click event listener to "create new board" button
    const createNewBoardButton = document.getElementById('createNewBoard');
    createNewBoardButton.addEventListener('click', handleShowCreateBoardForm);
}