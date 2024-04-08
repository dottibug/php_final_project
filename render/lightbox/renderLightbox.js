import {renderOverlay} from "./renderOverlay.js";
import {renderXButton} from "../uiElements/renderButton.js";
import {closeOtherMenus} from "../forms/formHandlers.js";

// ------------------------------------
// Render an overlay and lightbox
// ------------------------------------
export function renderLightbox(heading = 'Heading') {
    closeOtherMenus();

    // Disable body scrolling in the background
    const body = document.getElementById('body');
    body.setAttribute('style', "overflow: hidden");

    // Overlay
    renderOverlay();
    const overlay = document.getElementById('overlay');

    // Lightbox <div>
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';

    // Lightbox <header>
    const lightboxHeader = document.createElement('header');
    lightboxHeader.className = 'lightboxHeader';
    lightboxHeader.id = 'lightboxHeader';

    // Lightbox <h1>
    const lightboxHeading = document.createElement('h1');
    lightboxHeading.id = 'lightboxHeading';
    lightboxHeading.innerText = heading;

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
    const body = document.getElementById('body');
    body.setAttribute('style', "overflow: visible");

    // Remove overlay element from DOM
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.remove();
}