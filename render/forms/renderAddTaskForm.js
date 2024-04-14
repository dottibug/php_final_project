import {renderFields} from "./renderFields.js";
import {renderDropdown} from "../uiComponents/renderDropdown.js";
import {addDynamicItemButton, renderDynamicList} from "../uiComponents/renderDynamicList.js";
import {renderButton, renderButtonsWrapper} from "../uiComponents/renderButton.js";
import {renderFormElement} from "../uiComponents/renderFormElement.js";
import {addTask} from "../../eventHandlers/taskHandlers.js";

// 'Add Task' form
// -----------------------------------------------------------------------------
export function renderAddTaskForm(fields, lists, subtasks, selectedItem) {
    const listLabel = 'Subtasks';
    const placeholder = 'Add a subtask';

    // Form element
    const form = renderFormElement();

    // Fields
    const fieldsElement = renderFields(fields);

    // Dropdown menu
    const {selectedID, selectedValue} = getSelectedItem(selectedItem, lists);
    const dropdownMenu = renderDropdown(lists, 'Add To List', selectedID, selectedValue);

    // Dynamic list
    const dynamicList = renderDynamicList('deleteSubtask', subtasks, listLabel, placeholder);

    // Buttons
    const buttonsWrapper = renderButtonsWrapper();

    // Add subtask button
    const addSubtaskButton = addDynamicItemButton('Add New Subtask', 'addSubtaskButton', 'addSubtask', listLabel, placeholder);

    // Create task button
    const createTaskButton = renderButton('primary', 'small', 'Create Task', 'createTaskButton', 'submit');
    createTaskButton.addEventListener('click', (e) => addTask(e, listLabel, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dropdownMenu);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addSubtaskButton);
    buttonsWrapper.appendChild(createTaskButton);

    return form;
}

// Set the default selected item for dropdown menu
// -----------------------------------------------------------------------------
function getSelectedItem(selectedItem, lists) {
    if (selectedItem) {
        const list = lists.find(list => list.listID === selectedItem);
        const selectedID = list.listID;
        const selectedValue = list.title;
        return {selectedID, selectedValue};
    } else {
        const selectedID = lists[0]['listID'];
        const selectedValue = lists[0]['title'];
        return {selectedID, selectedValue};
    }
}