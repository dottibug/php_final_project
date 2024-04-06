import {handleShowNewBoardForm} from "../forms/formHandlers.js";
import {handleBoardClick} from "./handlersSidebar.js";

// RENDER SIDEBAR
export function renderSidebar(boards, currentBoardID) {
    // Heading with board count
    const sidebarHeading = document.getElementById('sidebarHeading');
    sidebarHeading.innerText = `All Boards (${boards.length})`;

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
    createBoardButton.addEventListener('click', handleShowNewBoardForm);
}