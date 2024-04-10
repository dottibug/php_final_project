import {findElement} from "./findElement.js";

export function removeElement(id) {
    const element = findElement(id);
    if (element) element.remove();
}