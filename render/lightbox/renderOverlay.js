import {findElement} from "../uiElements/findElement.js";
import {createElement} from "../uiElements/createElement.js";

export function renderOverlay() {
    const body = findElement('body');
    const overlay = createElement('div', 'overlay', 'overlay');
    body.insertAdjacentElement('afterbegin', overlay);
}