import {renderOverlay} from "./renderOverlay.js";
import {renderXButton} from "../uiElements/renderButton.js";
import {closeOtherMenus, refreshBoards} from "../forms/formHandlers.js";
import {findElement} from "../uiElements/findElement.js";
import {removeElement} from "../uiElements/removeElement.js";
import {createElement} from "../uiElements/createElement.js";

// ------------------------------------
// Render an overlay and lightbox
// ------------------------------------
export function renderLightbox(heading = 'Heading') {
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
    closeLightbox.addEventListener('click', () => handleCloseLightbox());

    // Compose lightbox
    overlay.appendChild(lightbox);
    lightbox.appendChild(lightboxHeader);
    lightboxHeader.appendChild(lightboxHeading);
    lightboxHeader.appendChild(closeLightbox);

    // Return the lightbox element
    return lightbox;
}

// ------------------------------------
// EVENT: Handle click close lightbox
// ------------------------------------
export function handleCloseLightbox() {
    // Re-enable body scroll
    const body = findElement('body');
    body.setAttribute('style', "overflow: visible");

    removeElement('overlay');
}