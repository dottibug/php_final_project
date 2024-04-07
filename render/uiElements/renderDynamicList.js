import {renderInput} from "./renderInput.js";
import {renderXButton} from "./renderButton.js";

export async function handleAddDynamicListItem(e, action, labelText, placeholder, hasErrors, message) {
    e.preventDefault();

    console.log('add dynamic list handler: ', action);
    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Temporary name for new input field
    const numLists = document.querySelectorAll('.dynamicListInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    const tempName = `item${numLists + randomNumber}`;

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('action', action);
    params.append(tempName, '');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    console.log('ADD list data: ', data);

    // Rendering
    if (data.success) {
        const list = action === 'addList' ? data.lists : data.subtasks;
        const deleteAction = action === 'addList' ? 'deleteList' : 'deleteSubtask';

        console.log('action after data.success: ', action);
        console.log('list based on action: ', list);

        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(deleteAction, list, labelText, placeholder, hasErrors, message);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }
}


async function handleDeleteDynamicListItem(e, action, labelText, placeholder, hasErrors, message) {
    e.preventDefault();
    const itemToDelete = e.target.closest('button').dataset.listItemName;
    // const action = e.target.closest('button').dataset.action;

    console.log('--- delete list action: ', action);
    console.log('item to delete: ', itemToDelete);

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Fetch
    const params = new URLSearchParams(formData);
    params.append('itemToDelete', itemToDelete);
    params.append('action', action);

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    console.log('-- delete list data: ', data);

    // Rendering
    if (data.success) {
        const list = action === 'deleteList' ? data.lists : data.subtasks;
        const deleteAction = action === 'addList' ? 'deleteList' : 'deleteSubtask';


        const dynamicListWrapper = document.getElementById('dynamicListWrapper');
        dynamicListWrapper.remove();

        const dynamicList = renderDynamicList(deleteAction, list, labelText, placeholder, hasErrors, message);

        const buttonsWrapper = document.getElementById('buttonsWrapper');
        buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
    }

}


// -----------------------------------------------------------------------------
// Render a dynamic list with deletable input fields
// -----------------------------------------------------------------------------
export function renderDynamicList(deleteAction, list, labelText, placeholder, hasErrors = false, message = '') {
    console.log('---DYNAMIC LIST list: ', list);

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
        deleteListItemButton.addEventListener('click', (e) => handleDeleteDynamicListItem(e, deleteAction, labelText, placeholder, hasErrors, message))

        // Compose
        dynamicListWrapper.appendChild(dynamicListItem);
        dynamicListItem.appendChild(input);
        dynamicListItem.appendChild(deleteListItemButton);
    })

    return dynamicListWrapper;
}