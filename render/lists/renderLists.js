import {renderSortButton} from "./renderSortButton.js";
import {renderTasks} from "./renderTasks.js";
import {showEditBoardForm} from "../../eventHandlers/boardMenuHandlers.js";
import {createElement, findElement} from "../uiElements/elements.js";


// Render lists
// -----------------------------------------------------------------------------
export function renderLists(lists) {
    const canvas = findElement('canvas');

    // Clear previous lists
    const listsContainer = createElement('div', 'lists', 'lists');
    canvas.appendChild(listsContainer);

    lists.forEach(list => {
        const {tasks, listID, color, title} = list;
        const numOfTasks = Object.keys(tasks).length;

        // List Wrapper
        const listWrapper = createElement('div', 'list', listID);

        // List header
        const listHeader = createElement('header', 'listHeader');

        // List heading wrapper
        const listHeadingWrapper = createElement('div', 'listHeadingWrapper', 'listHeadingWrapper');

        // Color bullet
        const colorBullet = createElement('span', 'iconCircle', '', '•');
        colorBullet.setAttribute('style', `color: ${color}`);

        // List heading
        const listHeading = createElement('h1', 'listTitle', '', `${title} (${numOfTasks})`);

        // Compose
        listWrapper.appendChild(listHeader);
        listHeader.appendChild(listHeadingWrapper);
        listHeadingWrapper.appendChild(colorBullet);
        listHeadingWrapper.appendChild(listHeading);

        // 'Sort' button
        if (tasks.length > 1) renderSortButton(listID, listHeader);

        // Tasks
        const tasksWrapper = renderTasks(tasks, listID, lists);

        // Compose
        listsContainer.insertAdjacentElement('beforeend', listWrapper);
        listWrapper.appendChild(tasksWrapper);
    });

    const addNewListButton = createElement('button', 'newListButton', 'newListButton', 'New List');
    addNewListButton.addEventListener('click', showEditBoardForm);
    canvas.appendChild(addNewListButton);
}