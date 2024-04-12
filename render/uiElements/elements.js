// Create an element
// -----------------------------------------------------------------------------------
export function createElement(tag, classname = '', id = '', innerText = '') {
    const element = document.createElement(tag);
    element.className = classname;
    element.id = id;
    element.innerText = innerText;
    return element;
}

// Find element by id
// -----------------------------------------------------------------------------------
export function findElement(id) {
    const element = document.getElementById(id);
    return element;
}

// Remove an element (by id) from the DOM
// -----------------------------------------------------------------------------------
export function removeElement(id) {
    const element = findElement(id);
    if (element) element.remove();
}

// Clear the inner HTML of an element (by id)
// -----------------------------------------------------------------------------------
export function clearElement(id) {
    const element = findElement(id);
    element.innerHTML = '';
}