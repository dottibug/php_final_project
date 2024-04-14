import {renderFields} from "./renderFields.js";
import {
    addDynamicItemButton,
    renderDynamicList
} from "../uiComponents/renderDynamicList.js";
import {renderButton, renderButtonsWrapper} from "../uiComponents/renderButton.js";
import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {addBoard} from "../../eventHandlers/boardHandlers.js";

// 'Create Board' form
// -----------------------------------------------------------------------------
export function renderCreateBoardForm(fields, lists) {
    const listLabel = 'Lists';
    const placeholder = 'Title of list';

    // Form element
    const form = renderFormElement();

    // Fields
    const fieldsElement = renderFields(fields);

    // Dynamic list
    const dynamicList = renderDynamicList('deleteList', lists, listLabel, placeholder);

    // Buttons wrapper
    const buttonsWrapper = renderButtonsWrapper();

    // Add list button
    const addListButton = addDynamicItemButton('Add New List', 'addListButton', 'addList', listLabel, placeholder);

    // Create board button
    const createBoardButton = renderButton('primary', 'small', 'Create Board', 'createBoardButton', 'submit');
    createBoardButton.addEventListener('click', (e) => addBoard(e, listLabel, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addListButton);
    buttonsWrapper.appendChild(createBoardButton);

    return form;
}