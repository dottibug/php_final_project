import {renderButton} from "../uiElements/renderButton.js";
import {showEditBoardForm} from "../../eventHandlers/boardMenuHandlers.js";
import {showAddTaskForm} from "../../eventHandlers/taskHandlers.js";
import {createElement, clearElement} from "../uiElements/elements.js";


// 'New List' placeholder
// -----------------------------------------------------------------------------
export function renderEmptyBoard() {
    // Clear canvas
    clearElement('canvas');

    // Empty board message and button
    const emptyBoard = createElement('div', 'emptyBoard');
    const message = 'This board is empty. Create a new list to get started.';
    const emptyBoardMessage = createElement('p', 'emptyBoardMessage', '', message);
    const createListButton = renderButton('primary', 'large', 'Add New List', 'emptyBoardNewListButton', 'submit');
    createListButton.addEventListener('click', showEditBoardForm);

    // Compose
    canvas.appendChild(emptyBoard);
    emptyBoard.appendChild(emptyBoardMessage);
    emptyBoard.appendChild(createListButton);
}

// 'New Task' placeholder
// -----------------------------------------------------------------------------
export function renderEmptyTaskBox(boxLabel, listID, tasksWrapper) {
    const emptyTaskBox = createElement('li', 'emptyTaskBox', '', boxLabel);
    emptyTaskBox.addEventListener('click', () => showAddTaskForm(listID));
    tasksWrapper.appendChild(emptyTaskBox);
}