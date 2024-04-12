import {renderOverlay} from "./renderOverlay.js";
import {renderXButton} from "../uiElements/renderButton.js";
import {closeOtherMenus} from "../forms/formHandlers.js";
import {removeElement, findElement, createElement} from "../uiElements/elements.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";

// Render overlay and lightbox
// -----------------------------------------------------------------------------
export function renderLightbox(heading = 'Heading', refreshOnClose) {
    closeOtherMenus();

    // Disable body scrolling in the background
    const body = findElement('body');
    body.setAttribute('style', "overflow: hidden");

    // Overlay
    renderOverlay();
    const overlay = findElement('overlay');

    // Lightbox <div>
    const lightbox = createElement('div', 'lightbox', 'lightbox');

    // Lightbox <header>
    const lightboxHeader = createElement('header', 'lightboxHeader', 'lightboxHeader');

    // Lightbox <h1>
    const lightboxHeading = createElement('h1', 'lightboxHeading', 'lightboxHeading', heading);

    // Close lightbox <button>
    const closeLightbox = renderXButton('iconCloseButton');
    closeLightbox.addEventListener('click', () => handleCloseLightbox(refreshOnClose));

    // Compose lightbox
    overlay.appendChild(lightbox);
    lightbox.appendChild(lightboxHeader);
    lightboxHeader.appendChild(lightboxHeading);
    lightboxHeader.appendChild(closeLightbox);

    // Return the lightbox element
    return lightbox;
}

// Close lightbox
// -----------------------------------------------------------------------------
export async function handleCloseLightbox(refreshOnClose) {
    if (refreshOnClose) {
        await fetchBoards();
        await fetchCurrentBoardLists();
    }

    // Re-enable body scroll
    const body = findElement('body');
    body.setAttribute('style', "overflow: visible");

    removeElement('overlay');
}