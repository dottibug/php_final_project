// Render textarea
export function renderTextarea(className = '', name, value) {
    const textarea = document.createElement('textarea');
    textarea.className = className;
    textarea.name = name;
    textarea.innerHTML = value;

    return textarea;
}