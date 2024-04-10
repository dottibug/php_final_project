import {
    showBoardMenu,
    showDeleteBoardWarning,
    showEditBoardForm
} from "../../eventHandlers/menus/boardMenuHandlers.js";
import {findElement} from "../uiElements/findElement.js";
import {createElement} from "../uiElements/createElement.js";

export function renderBoardMenu() {
    // Clear previous board menu event listeners
    const menus = document.querySelectorAll('.boardMenu');
    menus.forEach(boardMenu => boardMenu.remove());

    // Dashboard
    const dashboard = findElement('dashboard');

    // Menu <div>
    const boardMenu = createElement('div', 'menu boardMenu', 'boardMenu');
    boardMenu.addEventListener('mouseleave', (e) => showBoardMenu(e));

    // Menu nav <ul>
    const boardMenuNav = createElement('ul', 'boardMenuNav', 'boardMenuNav');

    // Edit board <li>
    const editBoard = createElement('li', 'boardMenuNavItem editBoard', 'editBoard', 'Edit Board');
    editBoard.addEventListener('click', showEditBoardForm);

    // Delete board <li>
    const deleteBoard = createElement('li', 'boardMenuNavItem deleteBoard', 'deleteBoard', 'Delete Board');
    deleteBoard.addEventListener('click', showDeleteBoardWarning);

    // Compose board menu
    dashboard.appendChild(boardMenu);
    boardMenu.appendChild(boardMenuNav);
    boardMenuNav.appendChild(editBoard);
    boardMenuNav.appendChild(deleteBoard);
}