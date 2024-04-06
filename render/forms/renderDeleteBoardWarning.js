import {renderButton} from "../uiElements/renderButton.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {handleDeleteBoard} from "./formHandlers.js";

export function renderDeleteBoardWarning(boardTitle) {
    // Form element
    const form = document.createElement('form');
    form.id = 'form';
    form.className = 'lightboxForm';

    // Message
    const warningMessage = document.createElement('p');
    warningMessage.className = 'warningMessage';
    warningMessage.innerHTML = `Are you sure you want to delete <span class="warningMessageSpan">${boardTitle}</span>? This will delete the board and its lists and tasks.`;

    // Buttons
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'buttonsWrapperWarning';
    buttonsWrapper.id = 'buttonsWrapperWarning';

    // Delete button
    const deleteBoardButton = renderButton('danger', 'small', 'Delete', 'deleteBoardButton', 'submit');
    deleteBoardButton.addEventListener('click', handleDeleteBoard);

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