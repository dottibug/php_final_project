import {renderFields} from "./renderFields.js";
import {handleAddDynamicListItem, renderDynamicList} from "../uiElements/renderDynamicList.js";
import {handleSaveBoardChanges} from "./formHandlers.js";
import {renderButton} from "../uiElements/renderButton.js";


export function renderEditBoardForm(fields, lists) {
    const labelText = 'Lists';
    const placeholder = 'Title of list';

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Fields
    const fieldsElement = renderFields(fields);

    // Dynamic list
    const dynamicList = renderDynamicList('deleteList', lists, labelText, placeholder);

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add list button
    const addListButton = renderButton('secondary', 'small', 'Add New List', 'addListButton', 'submit');
    addListButton.addEventListener('click', (e) => handleAddDynamicListItem(e, 'addList', labelText, placeholder));

    // Save changes button
    const saveChangesButton = renderButton('primary', 'small', 'Save Changes', 'saveChangesButton', 'submit');
    saveChangesButton.addEventListener('click', (e) => handleSaveBoardChanges(e, labelText, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addListButton);
    buttonsWrapper.appendChild(saveChangesButton);

    return form;
}