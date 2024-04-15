import {sidebarBoardSelection} from "../../eventHandlers/sidebarHandlers.js";
import {showCreateBoardForm} from "../../eventHandlers/boardHandlers.js";
import {removeElement, findElement, createElement} from "../uiComponents/elements.js";

// Render sidebar navigation
// -----------------------------------------------------------------------------
export function renderSidebar(boards, currentBoardID) {
    console.log('renderSidebar boards: ', boards);
    console.log('renderSidebar currentBoardID: ', currentBoardID);

    // Heading with board count
    const sidebarHeading = findElement('sidebarHeading');
    sidebarHeading.innerText = `All Boards (${boards.length})`;

    // Clear previous boards from sidebar
    boards.forEach(board => {
        console.log('boardID to remove before re-render: ', board.boardID);
        removeElement(board.boardID)
    });

    // Create new sidebar boards
    const createBoardButton = findElement('createNewBoard');
    console.log('createBoardButton element: ', createBoardButton);

    boards.forEach(board => {
        const {boardID, title} = board;

        console.log('board being rendered in sidebar: ', boardID);
        console.log('board title of board being rendered: ', title);

        // Board item
        const boardElementClass = boardID === parseInt(currentBoardID) ? 'board current' : 'board';
        const boardElement = createElement('li', boardElementClass, boardID);
        boardElement.dataset['boardId'] = boardID;
        boardElement.addEventListener('click', () => sidebarBoardSelection(boardID));

        // Board icon
        const imageElement = createElement('img', 'iconBoard');
        imageElement.src = boardID === parseInt(currentBoardID) ? '../images/iconBoardWhite.svg' : '../images/iconBoardGray.svg';

        // Board title
        const spanElement = createElement('span', 'boardLink', '', title);

        // Compose
        createBoardButton.insertAdjacentElement('beforebegin', boardElement);
        boardElement.appendChild(imageElement);
        boardElement.appendChild(spanElement);

    });

    // Add click event listener to "create new board" button
    createBoardButton.addEventListener('click', showCreateBoardForm);
}