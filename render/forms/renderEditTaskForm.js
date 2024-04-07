import {renderFields} from "./renderFields.js";
import {handleAddDynamicListItem, renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderDropdown} from "../uiElements/renderDropdown.js";
import {renderErrors, refreshBoards, getFormData, fetchData} from "./formHandlers.js";
import {renderButton} from "../uiElements/renderButton.js";

export function renderEditTaskForm(task, fields, lists, subtasks) {
    const {taskID, listID, listTitle} = task;
    const labelText = 'Subtasks';
    const placeholder = 'Add a subtask';

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Fields
    const fieldsElement = renderFields(fields);

    // Lists dropdown
    const listsDropdown = renderDropdown(lists, 'Move To List', listID, listTitle);

    // Subtasks
    const dynamicList = renderDynamicList('deleteSubtask', subtasks, labelText, placeholder);

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add subtask button
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddDynamicListItem(e, 'addSubtask', labelText, placeholder));

    // Save changes
    const saveChangesButton = renderButton('primary', 'small', 'Save Changes', 'saveChangesButton', 'submit');
    saveChangesButton.addEventListener('click', (e) => handleSaveTaskChanges(e, taskID, labelText, placeholder));

    // Compose
    form.appendChild(fieldsElement);
    form.appendChild(listsDropdown);
    form.appendChild(dynamicList);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(addSubtaskButton);
    buttonsWrapper.appendChild(saveChangesButton);

    return form;
}

async function handleSaveTaskChanges(e, taskID, labelText, placeholder) {
    e.preventDefault();

    // Fetch
    const action = 'editTask';
    const formData = getFormData();
    const listID = document.getElementById('dropdownButton').dataset.selectedId;
    const data = await fetchData(action, formData, {'taskID': taskID, 'listID': listID});
    
    // Render
    if (!data.success) renderErrors('deleteSubtask', data.fields, data.subtasks, labelText, placeholder);
    if (data.success) await refreshBoards();
}