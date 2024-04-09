import {createElement} from "./createElement.js";

// Button component
// -----------------------------------------------------------------------------------
export function renderButton(style = 'primary', size = 'small', label = 'Button', id = '', type = 'button') {
    const button = createElement('button', `button ${style} ${size}`, id, label);
    button.type = type;
    return button;
}

// Close 'x' button component
// -----------------------------------------------------------------------------------
export function renderXButton(classname = '', id = '') {
    const button = createElement('button', `iconX ${classname}`, id);
    const icon = createElement('span', 'material-symbols-outlined', '', 'close');
    button.appendChild(icon);
    return button;
}

// Button wrapper component
// -----------------------------------------------------------------------------------
export function renderButtonsWrapper(classname = 'buttonsWrapper', id = 'buttonsWrapper') {
    const buttonsWrapper = createElement('div', classname, id);
    return buttonsWrapper;
}