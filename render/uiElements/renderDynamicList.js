import {renderInput} from "./renderInput.js";
import {renderButton, renderXButton} from "./renderButton.js";
import {
    addDynamicListItem,
    deleteDynamicListItem,
} from "../../eventHandlers/dynamicListHandlers.js";
import {createElement} from "./createElement.js";

// Create dynamic list component that allows user to add/delete input fields
// -----------------------------------------------------------------------------------
export function renderDynamicList(deleteAction, list, listLabel, placeholder, hasErrors = false, message = '') {
    // console.log('--- RenderDynamicList data: ', list);

    // Dynamic list wrapper
    const dynamicListWrapper = createElement('div', 'dynamicListWrapper', 'dynamicListWrapper');

    // Dynamic list label
    const labelBox = createElement('div', 'labelBox');
    const label = createElement('label', 'inputLabel', '', listLabel);

    // Compose
    if (list.length !== 0) {
        dynamicListWrapper.appendChild(labelBox);
        labelBox.appendChild(label);
    }

    // Conditional error <p>
    if (hasErrors) {
        const fieldError = createElement('p', 'fieldError', '', message);
        labelBox.appendChild(fieldError);
    }

    list.forEach(item => {
        const {name, value} = item;

        // console.log('dynamicList item: ', item);

        const dynamicListItem = createElement('div', 'dynamicListItem');
        const input = renderInput(name, value, placeholder);
        input.classList.add('dynamicListInput');

        // Delete item <button>
        const deleteListItemButton = renderXButton('deleteListItemButton', name);
        deleteListItemButton.dataset['listItemName'] = name;
        deleteListItemButton.addEventListener('click', (e) => deleteDynamicListItem(e, deleteAction, listLabel, placeholder, hasErrors, message))

        // Compose
        dynamicListWrapper.appendChild(dynamicListItem);
        dynamicListItem.appendChild(input);
        dynamicListItem.appendChild(deleteListItemButton);
    })

    return dynamicListWrapper;
}

// Create button the handle adding an item to the dynamic input list
// -----------------------------------------------------------------------------------
export function addDynamicItemButton(buttonText, buttonID, buttonAction, listLabel, placeholder) {
    const addItemButton = renderButton('secondary', 'small', buttonText, buttonID, 'submit');
    addItemButton.addEventListener('click', (e) => addDynamicListItem(e, buttonAction, listLabel, placeholder));
    return addItemButton;
}