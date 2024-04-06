import {renderFields} from "./renderFields.js";
import {renderDropdown} from "../uiElements/renderDropdown.js";
import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {deleteSubtask} from "./formHandlers.js";
import {renderButton} from "../uiElements/renderButton.js";
import {handleAddSubtask} from "./formHandlers.js";
import {fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";

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
    const dynamicList = renderDynamicList(subtasks, labelText, deleteSubtask, placeholder);

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapper';
    buttonsWrapper.id = 'buttonsWrapper';

    // Add subtask button
    const addSubtaskButton = renderButton('secondary', 'small', 'Add New Subtask', 'addSubtaskButton', 'submit');
    addSubtaskButton.addEventListener('click', (e) => handleAddSubtask(e, labelText, placeholder));

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

    // Form data
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const listID = document.getElementById('dropdownButton').dataset.selectedId;
    const params = new URLSearchParams(formData);
    params.append('listID', listID);
    params.append('action', 'addTask');

    // Fetch
    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Rendering
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
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}