export function renderViewTask(task, subtasks) {
    const {taskID, description} = task;
    const subtasksArray = Object.values(subtasks);

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Task wrapper
    const taskWrapper = document.createElement('div');
    taskWrapper.className = 'taskWrapper';
    taskWrapper.id = 'taskWrapper';

    // Task description
    const taskDescription = document.createElement('p');
    taskDescription.className = 'taskDescription';
    taskDescription.id = 'taskDescription';
    taskDescription.innerText = description;

    // Subtask checkboxes
    const subtaskCheckboxes = renderCheckboxes(subtasksArray, taskID);

    // Compose
    form.appendChild(taskWrapper);
    taskWrapper.appendChild(taskDescription);
    taskWrapper.appendChild(subtaskCheckboxes);

    return form;
}

function getSubtasksCount(subtasks) {
    let total = 0;
    let checked = 0;
    subtasks.forEach(subtask => {
        if (subtask.status === 'checked') checked++;
        total++;
    });
    return {total: total, checked: checked};
}

function renderCheckboxes(subtasks, taskID) {
    // Subtasks wrapper
    const subtasksWrapper = document.createElement('div');
    subtasksWrapper.className = 'subtasksWrapper';
    subtasksWrapper.id = 'subtasksWrapper';

    // Subtasks label
    const {total, checked} = getSubtasksCount(subtasks);
    const subtasksLabel = document.createElement('label');
    subtasksLabel.className = 'subtasksLabel';
    subtasksLabel.id = 'subtasksLabel';
    subtasksLabel.innerText = `Subtasks (${checked} of ${total})`;
    subtasksLabel.setAttribute('style', 'text-transform: none');

    // Checkboxes wrapper
    const checkboxesWrapper = document.createElement('ul');
    checkboxesWrapper.className = 'checkboxesWrapper';
    checkboxesWrapper.id = 'checkboxesWrapper';

    // Compose
    subtasksWrapper.appendChild(subtasksLabel);
    subtasksWrapper.appendChild(checkboxesWrapper);

    // Checkbox
    subtasks.forEach(subtask => {
        const {subtaskID, description, status} = subtask;

        // List item
        const checkboxItem = document.createElement('li');
        checkboxItem.className = 'checkboxItem';
        checkboxItem.dataset.subtaskId = subtaskID;

        // Checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = subtaskID;
        checkbox.name = subtaskID;
        checkbox.value = description;
        checkbox.checked = status === 'checked';
        checkbox.addEventListener('click', (e) => handleCheckSubtask(e, taskID));

        // Checkbox label
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = status === 'checked' ? 'checkboxLabel checked' : 'checkboxLabel';
        checkboxLabel.for = subtaskID;
        checkboxLabel.innerText = description;

        // Compose
        checkboxesWrapper.appendChild(checkboxItem);
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(checkboxLabel);
    })
    return subtasksWrapper;
}

async function handleCheckSubtask(e, taskID) {
    const checkboxID = e.target.id;
    const checked = document.getElementById(checkboxID).checked;

    const params = new URLSearchParams({
        'action': 'updateSubtaskStatus',
        'subtaskID': checkboxID,
        'taskID': taskID
    })

    if (!checked) params.append('newStatus', 'unchecked');
    else params.append('newStatus', 'checked');

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (data.success) {
        const {subtasks, taskID} = data;

        const subtasksWrapper = document.getElementById('subtasksWrapper');
        subtasksWrapper.remove();

        const subtaskCheckboxes = renderCheckboxes(subtasks, taskID);
        const taskDescription = document.getElementById('taskDescription');
        taskDescription.insertAdjacentElement('afterend', subtaskCheckboxes);
    }
}