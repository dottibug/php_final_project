import {handleStrikeSubtask} from "./handlersViewTask.js";

export function renderSubtaskCheckboxes(subtasks, taskID) {
    const subtasksArray = Object.values(subtasks);

    // Count total subtasks and checked subtasks
    let total = 0;
    let checked = 0;
    subtasksArray.forEach(subtask => {
        if (subtask.status === 'checked') checked++;
        total++;
    });

    // Subtasks <label>
    const subtasksLabel = document.createElement('label');
    subtasksLabel.className = 'subtasksLabel';
    subtasksLabel.id = 'subtasksLabel';
    subtasksLabel.innerText = `Subtasks (${checked} of ${total})`;
    subtasksLabel.setAttribute('style', 'text-transform: none');

    // Container
    const subtasksCheckboxesContainer = document.createElement('ul');
    subtasksCheckboxesContainer.className = 'subtasksCheckboxesContainer';
    subtasksCheckboxesContainer.id = 'subtasksCheckboxesContainer';

    subtasksArray.forEach(subtask => {
        const {subtaskID, description, status} = subtask;

        // Subtask <li>
        const subtaskCheckboxItem = document.createElement('li');
        subtaskCheckboxItem.className = 'subtaskCheckboxItem';
        subtaskCheckboxItem.dataset['subtaskId'] = subtaskID;

        // Subtask checkbox <input>
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = subtaskID;
        checkbox.name = subtaskID;
        checkbox.value = description;
        checkbox.checked = status === 'checked';
        checkbox.addEventListener('click', (e) => handleStrikeSubtask(e, taskID));

        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = status === 'checked' ? 'checkboxLabel checked' : 'checkboxLabel';
        checkboxLabel.for = subtaskID;
        checkboxLabel.innerText = description;

        // Compose
        subtasksCheckboxesContainer.appendChild(subtaskCheckboxItem);
        subtaskCheckboxItem.appendChild(checkbox);
        subtaskCheckboxItem.appendChild(checkboxLabel);
    })

    // Compose
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.appendChild(subtasksLabel);
    taskContainer.appendChild(subtasksCheckboxesContainer);
    // subtasksCheckboxesContainer.appendChild(subtasksLabel);
}