import {renderButton, renderButtonsWrapper} from "../uiElements/renderButton.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {deleteBoard} from "../../eventHandlers/boardHandlers.js";
import {renderFormElement} from "../uiElements/renderFormElement.js";
import {createElement} from "../uiElements/elements.js";

// 'Delete Board' warning
// -----------------------------------------------------------------------------
export function renderDeleteBoardWarning(boardTitle) {
    // Form element
    const form = renderFormElement();

    // Message
    const warningMessage = createElement('p', 'warningMessage', 'warningMessage');
    warningMessage.innerHTML = `Are you sure you want to delete <span class="warningMessageSpan">${boardTitle}</span>? This will delete the board and its lists and tasks.`;

    // Buttons
    const buttonsWrapper = renderButtonsWrapper('buttonsWrapperWarning', 'buttonsWrapperWarning');

    // Delete button
    const deleteBoardButton = renderButton('danger', 'small', 'Delete', 'deleteBoardButton', 'submit');
    deleteBoardButton.addEventListener('click', deleteBoard);

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