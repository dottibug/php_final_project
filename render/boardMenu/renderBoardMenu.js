import {handleShowDeleteBoardWarning, handleShowEditBoardForm} from "./handlersBoardMenu.js";

export function renderBoardMenu() {
    // Dashboard
    const dashboard = document.getElementById('dashboard');

    // Menu <div>
    const boardMenu = document.createElement('div');
    boardMenu.className = 'boardMenu';
    boardMenu.id = 'boardMenu';

    // Menu nav <ul>
    const boardMenuNav = document.createElement('ul');
    boardMenuNav.className = 'boardMenuNav';

    // Edit board <li>
    const editBoard = document.createElement('li');
    editBoard.className = 'boardMenuNavItem editBoard';
    editBoard.id = 'editBoard';
    editBoard.innerText = 'Edit Board';
    editBoard.addEventListener('click', handleShowEditBoardForm);

    // Delete board <li>
    const deleteBoard = document.createElement('li');
    deleteBoard.className = 'boardMenuNavItem deleteBoard';
    deleteBoard.id = 'deleteBoard';
    deleteBoard.innerText = 'Delete Board';
    deleteBoard.addEventListener('click', handleShowDeleteBoardWarning);

    // Compose board menu
    dashboard.appendChild(boardMenu);
    boardMenu.appendChild(boardMenuNav);
    boardMenuNav.appendChild(editBoard);
    boardMenuNav.appendChild(deleteBoard);
}