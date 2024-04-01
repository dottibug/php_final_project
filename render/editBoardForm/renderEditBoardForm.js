import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";
import {renderEditBoardLists} from "./renderEditBoardLists.js";
import {renderButton} from "../uiElements/renderButton.js";
import {handleAddList, handleSaveBoardChanges} from "./handlersEditBoard.js";

// import {handleAddList, handleCreateBoard} from "../createNewBoardForm/handlersCreateBoard.js";

export function renderEditBoardForm(fields, lists) {
    // Lightbox
    renderLightbox('Edit Board');
    const lightbox = document.getElementById('lightbox');

    // Edit board form
    const lightboxForm = document.createElement('form');
    lightboxForm.id = 'lightboxForm';
    lightboxForm.className = 'lightboxForm';

    // Container <div> for non-dynamic fields
    const boardDetails = document.createElement('div');
    boardDetails.className = 'boardDetails';
    boardDetails.id = 'boardDetails';

    // Board details form fields (non-dynamic input of title)
    renderLightboxFormFields(fields, boardDetails);

    // Lists of the current board
    renderEditBoardLists(lists, lightboxForm);

    // Add list <button>
    const addListButton = renderButton('secondary', 'small', 'Add New List', 'addNewListButton', 'submit');
    addListButton.addEventListener('click', (e) => handleAddList(e));
    lightboxForm.appendChild(addListButton);

    // Save changes <button>
    const saveChangesToBoardButton = renderButton('primary', 'small', 'Save Changes', 'saveChangesToBoardButton', 'submit');
    saveChangesToBoardButton.addEventListener('click', (e) => handleSaveBoardChanges(e));
    lightboxForm.appendChild(saveChangesToBoardButton);

    // Compose
    lightbox.appendChild(lightboxForm);
    lightboxForm.insertAdjacentElement('afterbegin', boardDetails);
}