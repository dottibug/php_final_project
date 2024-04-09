// Render textarea
import {createElement} from "./createElement.js";

export function renderTextarea(name, value) {
    const textarea = createElement('textarea', 'textarea', '', value);
    textarea.name = name;
    return textarea;
}