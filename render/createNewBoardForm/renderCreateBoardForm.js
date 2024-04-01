import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderButton} from "../uiElements/renderButton.js";
import {renderCreateBoardLists} from "./renderCreateBoardLists.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";
import {handleCreateBoard, handleAddList} from "./handlersCreateBoard.js";

// Render create board form
export function renderCreateBoardForm(fields, lists, heading) {
    // Lightbox
    renderLightbox(heading);
    const lightbox = document.getElementById('lightbox');

    // Create board <form>
    const lightboxForm = document.createElement('form');
    lightboxForm.id = 'lightboxForm';
    lightboxForm.className = 'lightboxForm';

    // Container <div> for non-dynamic fields
    const boardDetails = document.createElement('div');
    boardDetails.className = 'boardDetails';
    boardDetails.id = 'boardDetails';

    // Board details form fields (non-dynamic input of title)
    renderLightboxFormFields(fields, boardDetails);

    // Lists for the new board (fields can be added or deleted by user)
    renderCreateBoardLists(lists, lightboxForm);

    // Add list <button>
    const addListButton = renderButton('secondary', 'small', 'Add New List', 'addNewListButton', 'submit');
    addListButton.addEventListener('click', (e) => handleAddList(e));
    lightboxForm.appendChild(addListButton);

    // Create board <button>
    const createBoardButton = renderButton('primary', 'small', 'Create Board', 'createBoardButton', 'submit');
    createBoardButton.addEventListener('click', (e) => handleCreateBoard(e));
    lightboxForm.appendChild(createBoardButton);

    // Compose
    lightbox.appendChild(lightboxForm);
    lightboxForm.insertAdjacentElement('afterbegin', boardDetails);
}