import {showSortMenu, sortTasks} from "../../eventHandlers/sortMenuHandlers.js";
import {createElement, findElement} from "../uiComponents/elements.js";

// 'Sort Tasks' menu
// -----------------------------------------------------------------------------
export function renderSortMenu(listID) {
    const listElement = findElement(listID);

    // Menu <div>
    const sortMenu = createElement('div', 'menu sortMenu', `sortMenu${listID}`);
    sortMenu.addEventListener('mouseleave', (e) => showSortMenu(e));

    // Menu nav <ul>
    const sortMenuNav = createElement('ul', 'sortMenuNav');

    // Sort by newest <li>
    const sortByNewest = createElement('li', 'sortMenuNavItem', '', 'Sort by newest');
    sortByNewest.dataset.listId = listID;
    sortByNewest.dataset.action = 'newest';
    sortByNewest.addEventListener('click', (e) => sortTasks(e));

    // Sort by oldest <li>
    const sortByOldest = createElement('li', 'sortMenuNavItem', '', 'Sort by oldest');
    sortByOldest.dataset.listId = listID;
    sortByOldest.dataset.action = 'oldest';
    sortByOldest.addEventListener('click', (e) => sortTasks(e));

    // Compose
    listElement.appendChild(sortMenu);
    sortMenu.appendChild(sortMenuNav);
    sortMenuNav.appendChild(sortByNewest);
    sortMenuNav.appendChild(sortByOldest);
}