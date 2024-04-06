import {renderFields} from "./renderFields.js";
import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderDropdown} from "../uiElements/renderDropdown.js";
import {deleteSubtask, handleAddSubtask} from "./formHandlers.js";
import {renderButton} from "../uiElements/renderButton.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";

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
    const dynamicList = renderDynamicList(subtasks, labelText, deleteSubtask, placeholder);

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add subtask button
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddSubtask(e, labelText, placeholder));

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

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const params = new URLSearchParams(formData);
    params.append('action', 'editTask');
    params.append('taskID', taskID);

    const listID = document.getElementById('dropdownButton').dataset.selectedId;
    params.append('listID', listID);

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (!data.success) {
        const {fields, subtasks} = data;
        // Re-render fields if any have errors
        fields.forEach(field => {
            if (field.hasError) {
                const fieldsWrapper = document.getElementById('fieldsWrapper');
                fieldsWrapper.remove();

                const newFieldsWrapper = renderFields(fields);
                const form = document.getElementById('form');
                form.insertAdjacentElement('afterbegin', newFieldsWrapper);
            }
        })

        // Re-render subtasks if any have errors
        subtasks.forEach(subtask => {
            const {message} = subtask;
            if (subtask.hasError) {
                const dynamicListWrapper = document.getElementById('dynamicListWrapper');
                dynamicListWrapper.remove();

                const newDynamicListWrapper = renderDynamicList(subtasks, labelText, deleteSubtask, placeholder, true, message);
                const buttonsWrapper = document.getElementById('buttonsWrapper');
                buttonsWrapper.insertAdjacentElement('beforebegin', newDynamicListWrapper);
            }
        })
    }

    // Re-fetch updated lists, tasks, and subtasks
    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}