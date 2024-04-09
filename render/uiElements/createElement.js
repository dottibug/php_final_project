export function createElement(tag, classname = '', id = '', innerText = '') {
    const element = document.createElement(tag);
    element.className = classname;
    element.id = id;
    element.innerText = innerText;
    return element;
}