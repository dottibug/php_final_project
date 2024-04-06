import {renderFields} from "./renderFields.js";
import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderButton} from "../uiElements/renderButton.js";
import {handleAddBoard, handleAddList, deleteList} from "./formHandlers.js";


export function renderNewBoardForm(fields, lists) {
    const labelText = 'Lists';
    const placeholder = 'Title of list';

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Fields
    const fieldsElement = renderFields(fields);

    // Dynamic list
    const dynamicList = renderDynamicList(lists, labelText, deleteList, placeholder);

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add list button
    const addListButton = renderButton('secondary', 'small', 'Add New List', 'addListButton', 'submit');
    addListButton.addEventListener('click', (e) => handleAddList(e, labelText, placeholder));

    // Create board button
    const createBoardButton = renderButton('primary', 'small', 'Create Board', 'createBoardButton', 'submit');
    createBoardButton.addEventListener('click', (e) => handleAddBoard(e, labelText, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addListButton);
    buttonsWrapper.appendChild(createBoardButton);

    return form;
}