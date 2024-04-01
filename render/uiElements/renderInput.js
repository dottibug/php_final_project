// Render input
export function renderInput(type = 'text', className = '', name, value, placeholder = '') {
    const input = document.createElement('input');
    input.type = type;
    input.className = className;
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;

    return input;
}