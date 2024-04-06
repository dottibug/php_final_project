import {renderButton} from "../uiElements/renderButton.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";

export function renderDeleteTaskWarning(task) {
    const {title, taskID} = task;

    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Message
    const warningMessage = document.createElement('p');
    warningMessage.className = 'warningMessage';
    warningMessage.innerHTML = `Are you sure you want to delete <span class="warningMessageSpan">${title}</span>? This will delete the task and its subtasks.`;

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapperWarning';
    buttonsWrapper.id = 'buttonsWrapperWarning';

    // Delete button
    const deleteBoardButton = renderButton('danger', 'small', 'Delete', 'deleteBoardButton', 'submit');
    deleteBoardButton.addEventListener('click', (e) => handleDeleteTask(e, taskID));

    // Cancel button
    const cancelButton = renderButton('secondary', 'small', 'Cancel', 'cancelDeleteBoardButton', 'submit');
    cancelButton.addEventListener('click', handleCloseLightbox);

    // Compose
    form.appendChild(warningMessage);
    form.appendChild(buttonsWrapper);
    buttonsWrapper.appendChild(deleteBoardButton);
    buttonsWrapper.appendChild(cancelButton);

    return form;
}

async function handleDeleteTask(e, taskID) {
    e.preventDefault();

    const params = new URLSearchParams({
        'action': 'deleteTask',
        'taskID': taskID
    });

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}