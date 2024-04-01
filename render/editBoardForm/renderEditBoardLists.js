import {renderInput} from "../uiElements/renderInput.js";
import {renderXButton} from "../uiElements/renderButton.js";
import {handleDeleteList} from './handlersEditBoard.js';

export function renderEditBoardLists(lists, lightboxForm, hasErrors = false, errMsg = '') {
    // Starting lists container <div>
    const listsContainer = document.createElement('div');
    listsContainer.className = 'startingLists';
    listsContainer.id = 'startingLists';

    // Lists <label>
    const labelContainer = document.createElement('div');
    labelContainer.className = 'labelContainer';

    const listsLabel = document.createElement('label');
    listsLabel.className = 'listsLabel';
    listsLabel.innerText = 'Lists';
    labelContainer.appendChild(listsLabel);

    // Conditional error <p>
    if (hasErrors) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'fieldError';
        errorMessage.innerText = errMsg;
        labelContainer.appendChild(errorMessage);
    }

    // Compose list container
    lightboxForm.appendChild(listsContainer);
    listsContainer.appendChild(labelContainer);

    lists.forEach(list => {
        // List container <div>
        const listContainer = document.createElement('div');
        listContainer.className = 'startingList';

        // List <input>
        const listInput = renderInput('text', 'startingListInput',
            list.name, list.value, 'List name');

        // Delete list <button>
        const deleteListButton = renderXButton('iconDeleteButton', list.name);
        deleteListButton.dataset['listName'] = list.name;
        deleteListButton.addEventListener('click', (e) => handleDeleteList(e));

        // Compose list
        listsContainer.appendChild(listContainer);
        listContainer.appendChild(listInput);
        listContainer.appendChild(deleteListButton);
    });
}