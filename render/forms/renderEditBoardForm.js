import {renderFields} from "./renderFields.js";
import {
    addDynamicItemButton,
    renderDynamicList
} from "../uiComponents/renderDynamicList.js";
import {renderButton, renderButtonsWrapper} from "../uiComponents/renderButton.js";
import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {saveBoardChanges} from "../../eventHandlers/boardHandlers.js";

// 'Edit Board' form
// -----------------------------------------------------------------------------
export function renderEditBoardForm(fields, lists) {
    const listLabel = 'Lists';
    const placeholder = 'Title of list';

    // Form element
    const form = renderFormElement();

    // Fields
    const fieldsElement = renderFields(fields);

    // Dynamic list
    const dynamicList = renderDynamicList('deleteList', lists, listLabel, placeholder);

    // Buttons
    const buttonsWrapper = renderButtonsWrapper();

    // Add list button
    const addListButton = addDynamicItemButton('Add New List', 'addListButton', 'addList', listLabel, placeholder);

    // Save changes button
    const saveChangesButton = renderButton('primary', 'small', 'Save Changes', 'saveChangesButton', 'submit');
    saveChangesButton.addEventListener('click', (e) => saveBoardChanges(e, listLabel, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addListButton);
    buttonsWrapper.appendChild(saveChangesButton);

    return form;
}