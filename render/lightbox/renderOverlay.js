import {createElement, findElement} from "../uiComponents/elements.js";


// Renders overlay
// -----------------------------------------------------------------------------
export function renderOverlay() {
    const body = findElement('body');
    const overlay = createElement('div', 'overlay', 'overlay');
    body.insertAdjacentElement('afterbegin', overlay);
}