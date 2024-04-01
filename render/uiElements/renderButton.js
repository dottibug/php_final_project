export function renderButton(style = 'primary', size = 'small', label = 'Button', id = '', type = 'button') {
    const button = document.createElement('button');
    button.type = type;
    button.className = `button ${style} ${size}`;
    button.innerText = label;
    button.id = id;

    return button;
}

export function renderXButton(classname = '', id = '') {
    const button = document.createElement('button');
    button.className = `iconX ${classname}`;
    button.id = id;

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.innerText = 'close';
    button.appendChild(icon);

    return button;
}