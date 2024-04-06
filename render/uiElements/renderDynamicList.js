import {renderInput} from "./renderInput.js";
import {renderXButton} from "./renderButton.js";

// -----------------------------------------------------------------------------
// Render a dynamic list with deletable input fields
// -----------------------------------------------------------------------------
export function renderDynamicList(list, labelText, deleteItemFunction, placeholder = '', hasErrors = false, message = '') {

    console.log('list to render: ', list);

    // Dynamic list wrapper
    const dynamicListWrapper = document.createElement('div');
    dynamicListWrapper.className = 'dynamicListWrapper';
    dynamicListWrapper.id = 'dynamicListWrapper';

    // Dynamic list label
    const labelBox = document.createElement('div');
    labelBox.className = 'labelBox';

    const label = document.createElement('label');
    label.className = 'inputLabel';
    label.innerText = labelText;

    // Compose
    dynamicListWrapper.appendChild(labelBox);
    labelBox.appendChild(label);

    // Conditional error <p>
    if (hasErrors) {
        const fieldError = document.createElement('p');
        fieldError.className = 'fieldError';
        fieldError.innerText = message;
        labelBox.appendChild(fieldError);
    }

    list.forEach(item => {
        const {name, value} = item;

        const dynamicListItem = document.createElement('div');
        dynamicListItem.className = 'dynamicListItem';

        const input = renderInput(name, value, placeholder);
        input.classList.add('dynamicListInput');

        // Delete item <button>
        const deleteListItemButton = renderXButton('deleteListItemButton', name);
        deleteListItemButton.dataset['listItemName'] = name;
        deleteListItemButton.addEventListener('click', (e) => handleDeleteListItem(e, deleteItemFunction, labelText, placeholder));

        // Compose
        dynamicListWrapper.appendChild(dynamicListItem);
        dynamicListItem.appendChild(input);
        dynamicListItem.appendChild(deleteListItemButton);
    })

    return dynamicListWrapper;
}

// -----------------------------------------------------------------------------
// EVENT: Delete item from the dynamic list
// -----------------------------------------------------------------------------
function handleDeleteListItem(e, deleteItemFunction, labelText, placeholder) {
    e.preventDefault();
    const itemToDelete = e.target.closest('button').dataset.listItemName;
    deleteItemFunction(itemToDelete, labelText, placeholder);
}