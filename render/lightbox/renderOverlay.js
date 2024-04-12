import {createElement, findElement} from "../uiElements/elements.js";


// Renders overlay
// -----------------------------------------------------------------------------
export function renderOverlay() {
    const body = findElement('body');
    const overlay = createElement('div', 'overlay', 'overlay');
    body.insertAdjacentElement('afterbegin', overlay);
}