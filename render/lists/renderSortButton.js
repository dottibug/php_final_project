import {createElement} from "../uiElements/createElement.js";
import {showSortMenu} from "../../eventHandlers/menus/sortMenuHandlers.js";

export function renderSortButton(listID, listHeader) {
    const sortButtonWrapper = createElement('div', 'sortButtonWrapper', 'sortButtonWrapper');
    const sortButton = createElement('button', 'sortButton');
    sortButton.title = 'Sort List';
    sortButton.dataset.listId = listID;
    sortButton.addEventListener('click', (e) => showSortMenu(e));
    listHeader.appendChild(sortButtonWrapper);
    sortButtonWrapper.appendChild(sortButton);
}