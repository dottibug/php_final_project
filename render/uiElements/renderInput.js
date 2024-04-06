// Render input
export function renderInput(name, value, placeholder = '') {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'textInput';
    input.name = name;
    input.value = value;
    input.placeholder = placeholder;

    return input;
}