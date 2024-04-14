import {createElement} from "./elements.js";

export function renderTextarea(name, value) {
    const textarea = createElement('textarea', 'textarea', '', value);
    textarea.name = name;
    return textarea;
}