import {renderFields} from "./renderFields.js";
import {renderDropdown} from "../uiElements/renderDropdown.js";
import {addDynamicItemButton, renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderButton, renderButtonsWrapper} from "../uiElements/renderButton.js";
import {renderFormElement} from "../uiElements/renderFormElement.js";
import {addTask} from "../../eventHandlers/forms/taskHandlers.js";

export function renderAddTaskForm(fields, lists, subtasks) {
    const listLabel = 'Subtasks';
    const placeholder = 'Add a subtask';

    // Form element
    const form = renderFormElement();

    // Fields
    const fieldsElement = renderFields(fields);

    // Dropdown menu
    const selectedID = lists[0]['listID'];
    const selectedValue = lists[0]['title'];
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
