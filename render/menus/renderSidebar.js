import {sidebarBoardSelection} from "../../eventHandlers/menus/sidebarHandlers.js";
import {showCreateBoardForm} from "../../eventHandlers/forms/boardHandlers.js";
import {findElement} from "../uiElements/findElement.js";
import {createElement} from "../uiElements/createElement.js";
import {removeElement} from "../uiElements/removeElement.js";

// -----------------------------------------------------------------------------
// Render sidebar navigation
// -----------------------------------------------------------------------------
export function renderSidebar(boards, currentBoardID) {
    // Heading with board count
    const sidebarHeading = findElement('sidebarHeading');
    sidebarHeading.innerText = `All Boards (${boards.length})`;

    // Clear previous boards from sidebar
    boards.forEach(board => removeElement(board.boardID));

    // Create new sidebar boards
    const createBoardButton = findElement('createNewBoard');
    boards.forEach(board => {
        const {boardID, title} = board;

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