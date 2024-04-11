import {renderDynamicList} from "../uiElements/renderDynamicList.js";
import {renderFields} from "./renderFields.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {removeElement} from "../uiElements/removeElement.js";
import {findElement} from "../uiElements/findElement.js";


// -----------------------------------------------------------------------------
// Re-fetch board data and close the lightbox form
// -----------------------------------------------------------------------------
export async function refreshBoards(closeLightbox = false) {
    console.log('Refreshing boards');

    await fetchBoards();
    console.log('boards fetched');


    await fetchCurrentBoardLists();
    console.log('current board lists fetched')

    if (closeLightbox) await handleCloseLightbox();
}

// -----------------------------------------------------------------------------
// Close other menus
// -----------------------------------------------------------------------------
export function closeOtherMenus() {
    const menus = document.querySelectorAll('.menu');
    menus.forEach(menu => menu.remove());
}

// -----------------------------------------------------------------------------
// Render errors
// -----------------------------------------------------------------------------
export function renderErrors(deleteAction, fields, dynamicList, labelText, placeholder) {
    fields.forEach(field => {
        // Render field errors
        if (field.hasError) {
            removeElement('fieldsWrapper');
            const newFieldsWrapper = renderFields(fields);
            const form = findElement('form');
            form.insertAdjacentElement('afterbegin', newFieldsWrapper);
        }
    })

    // Render dynamic list errors
    dynamicList.forEach(list => {
        const {message} = list;
        if (list.hasError) {
            removeElement('dynamicListWrapper');
            const newDynamicListWrapper = renderDynamicList(deleteAction, dynamicList, labelText, placeholder, true, message);
            const buttonsWrapper = findElement('buttonsWrapper');
            buttonsWrapper.insertAdjacentElement('beforebegin', newDynamicListWrapper);
        }
    })
}


// -----------------------------------------------------------------------------
// Get form data
// -----------------------------------------------------------------------------
export function getFormData() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    return formData;
}


// -----------------------------------------------------------------------------
// Fetch data
// -----------------------------------------------------------------------------
export async function fetchData(action, formData = {}, otherParams = {}) {
    const params = new URLSearchParams(formData);
    params.append('action', action);

    for (const [key, value] of Object.entries(otherParams)) {
        params.append(key, value);
    }

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    return await response.json();
}