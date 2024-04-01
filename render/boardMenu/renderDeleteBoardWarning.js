import {handleCloseLightbox, renderLightbox} from "../lightbox/renderLightbox.js";
import {renderButton} from "../uiElements/renderButton.js";
import {handleDeleteBoard} from "./handlersBoardMenu.js";

export function renderDeleteBoardWarning(boardTitle) {
    // Render the lightbox
    renderLightbox('Delete this board?');

    // Change color of the lightbox <h1>
    const lightboxHeading = document.getElementById('lightboxHeading');
    lightboxHeading.setAttribute('style', "color: #EA5555");

    // Warning message <p>
    const warningMessage = document.createElement('p');
    warningMessage.className = 'warningMessage';
    warningMessage.innerText = `Are you sure you want to delete the '${boardTitle}' board? This action will remove all lists and tasks. It cannot be undone.`;

    // Buttons <div>
    const actionButtons = document.createElement('div');
    actionButtons.className = 'actionButtons';

    // Render delete <button>
    const deleteButton = renderButton('danger', 'small', 'Delete', 'deleteBoardButton', 'submit');
    deleteButton.addEventListener('click', handleDeleteBoard);

    // Render cancel <button>
    const cancelButton = renderButton('secondary', 'small', 'Cancel', 'cancelDeleteBoardButton', 'submit');
    cancelButton.addEventListener('click', handleCloseLightbox);

    // Compose warning lightbox
    const lightbox = document.getElementById('lightbox');
    lightbox.appendChild(warningMessage);
    lightbox.appendChild(actionButtons);
    actionButtons.appendChild(deleteButton);
    actionButtons.appendChild(cancelButton);
}