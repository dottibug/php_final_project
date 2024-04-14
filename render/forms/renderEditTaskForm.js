import {renderFields} from "./renderFields.js";
import {
    addDynamicItemButton,
    renderDynamicList
} from "../uiComponents/renderDynamicList.js";
import {renderDropdown} from "../uiComponents/renderDropdown.js";
import {renderButton, renderButtonsWrapper} from "../uiComponents/renderButton.js";
import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {saveTaskChanges} from "../../eventHandlers/taskHandlers.js";

// 'Edit Task' form
// -----------------------------------------------------------------------------
export function renderEditTaskForm(task, fields, lists, subtasks) {
    const {taskID, listID, listTitle} = task;
    const listLabel = 'Subtasks';
    const placeholder = 'Add a subtask';

    // Form element
    const form = renderFormElement();

    // Fields
    const fieldsElement = renderFields(fields);

    // Lists dropdown
    const listsDropdown = renderDropdown(lists, 'Move To List', listID, listTitle);

    // Subtasks
    const dynamicList = renderDynamicList('deleteSubtask', subtasks, listLabel, placeholder);

    // Buttons
    const buttonsWrapper = renderButtonsWrapper();

    // Add subtask button
    const addSubtaskButton = addDynamicItemButton('Add New Subtask', 'addSubtaskButton', 'addSubtask', listLabel, placeholder);

    // Save changes
    const saveChangesButton = renderButton('primary', 'small', 'Save Changes', 'saveChangesButton', 'submit');
    saveChangesButton.addEventListener('click', (e) => saveTaskChanges(e, taskID, listLabel, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(listsDropdown);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addSubtaskButton);
    buttonsWrapper.appendChild(saveChangesButton);

    return form;
}