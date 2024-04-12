import {fetchData} from "../forms/formHandlers.js";
import {removeElement, findElement, createElement} from "./elements.js";

export function renderCheckboxList(subtasks, taskID) {
    // Subtasks wrapper
    const subtasksWrapper = createElement('div', 'subtasksWrapper', 'subtasksWrapper');

    // Subtasks label
    const {total, checked} = getSubtasksCount(subtasks);
    const subtasksText = `Subtasks (${checked} of ${total})`;
    const subtasksLabel = createElement('label', 'subtasksLabel', 'subtasksLabel', subtasksText);
    subtasksLabel.setAttribute('style', 'text-transform: none');

    // Checkboxes wrapper
    const checkboxesWrapper = createElement('ul', 'checkboxesWrapper', 'checkboxesWrapper');

    // Compose
    subtasksWrapper.appendChild(subtasksLabel);
    subtasksWrapper.appendChild(checkboxesWrapper);

    // Checkbox
    subtasks.forEach(subtask => {
        const {subtaskID, description, status} = subtask;

        // List item
        const checkboxItem = createElement('li', 'checkboxItem');
        checkboxItem.dataset.subtaskId = subtaskID;

        // Checkbox input
        const checkbox = createElement('input', '', subtaskID);
        checkbox.type = 'checkbox';
        checkbox.name = subtaskID;
        checkbox.value = description;
        checkbox.checked = status === 'checked';
        checkbox.addEventListener('click', (e) => handleCheckSubtask(e, taskID));

        // Checkbox label
        const checkboxLabelClass = status === 'checked' ? 'checkboxLabel checked' : 'checkboxLabel';
        const checkboxLabel = createElement('label', checkboxLabelClass, '', description);
        checkboxLabel.for = subtaskID;

        // Compose
        checkboxesWrapper.appendChild(checkboxItem);
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(checkboxLabel);
    })
    return subtasksWrapper;
}

// Checking/unchecking a subtask
// -----------------------------------------------------------------------------------
async function handleCheckSubtask(e, taskID) {
    const checkboxID = e.target.id;
    const checked = findElement(checkboxID).checked;
    const newStatus = checked ? 'checked' : 'unchecked';

    // Fetch
    const action = 'updateSubtaskStatus';
    const res = await fetchData(action, {}, {
        'subtaskID': checkboxID,
        'taskID': taskID,
        'newStatus': newStatus
    })

    // Render
    if (res.success) {
        const {taskID} = res.data;
        const subtasks = Object.values(res.data.subtasks);
        removeElement('subtasksWrapper');
        const subtaskCheckboxes = renderCheckboxList(subtasks, taskID);
        const taskDescription = findElement('taskDescription');
        taskDescription.insertAdjacentElement('afterend', subtaskCheckboxes);
    }
}

// Get total subtask count and number of checked subtasks
// -----------------------------------------------------------------------------------
export function getSubtasksCount(subtasks) {
    let total = 0;
    let checked = 0;
    subtasks.forEach(subtask => {
        if (subtask.status === 'checked') checked++;
        total++;
    });
    return {total: total, checked: checked};
}