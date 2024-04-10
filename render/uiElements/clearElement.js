import {findElement} from "./findElement.js";

export function clearElement(id) {
    const element = findElement(id);
    element.innerHTML = '';
}