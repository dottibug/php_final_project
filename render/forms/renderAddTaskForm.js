import {renderFields} from "./renderFields.js";
import {renderDropdown} from "../uiElements/renderDropdown.js";
import {handleAddDynamicListItem, renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderErrors, refreshBoards, getFormData, fetchData} from "./formHandlers.js";
import {renderButton} from "../uiElements/renderButton.js";

export function renderAddTaskForm(fields, lists, subtasks) {
    const labelText = 'Subtasks';
    const placeholder = 'Add a subtask';

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Fields
    const fieldsElement = renderFields(fields);

    // Dropdown menu
    const selectedID = lists[0]['listID'];
    const selectedValue = lists[0]['title'];
    const dropdownMenu = renderDropdown(lists, 'Add To List',
        selectedID, selectedValue);

    // Dynamic list
    const dynamicList = renderDynamicList('deleteSubtask', subtasks, labelText, placeholder);

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add subtask button
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddDynamicListItem(e, 'addSubtask', labelText, placeholder));

    // Create task button
    const createTaskButton = renderButton('primary', 'small', 'Create Task', 'createTaskButton', 'submit');
    createTaskButton.addEventListener('click', (e) => handleAddTask(e, labelText, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(dropdownMenu);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addSubtaskButton);
    buttonsWrapper.appendChild(createTaskButton);

    return form;
}

async function handleAddTask(e, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'addTask';
    const formData = getFormData();
    const listID = document.getElementById('dropdownButton').dataset.selectedId;
    const data = await fetchData(action, formData, {'listID': listID});

    // Render
    if (!data.success) renderErrors('deleteSubtask', data.fields, data.subtasks, labelText, placeholder);
    if (data.success) await refreshBoards();
}