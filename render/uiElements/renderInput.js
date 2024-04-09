// Render input
import {createElement} from "./createElement.js";

export function renderInput(name, value, placeholder = '') {
    const input = createElement('input', 'textInput');
    input.type = 'text';
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;
    return input;
}