// Render textarea
export function renderTextarea(name, value) {
    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.name = name;
    textarea.innerHTML = value;

    return textarea;
}