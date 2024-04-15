import {renderDynamicList} from "../uiComponents/renderDynamicList.js";
import {renderFields} from "./renderFields.js";
import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {removeElement, findElement} from "../uiComponents/elements.js";

// Refresh sidebar and/or board lists (with option to close lightbox)
// -----------------------------------------------------------------------------
export async function refresh(refreshSidebar = false, refreshLists = true, closeLightbox = true) {
    if (refreshSidebar) await fetchBoards();
    if (refreshLists) await fetchCurrentBoardLists();
    if (closeLightbox) await handleCloseLightbox();
}

// Render errors
// -----------------------------------------------------------------------------
export function renderErrors(deleteAction, fields, dynamicList, labelText, placeholder) {
    // Render field errors
    removeElement('fieldsWrapper');
    const newFieldsWrapper = renderFields(fields);
    const form = findElement('form');
    form.insertAdjacentElement('afterbegin', newFieldsWrapper);

    // Render dynamic list errors
    removeElement('dynamicListWrapper');
    const listsWithErrors = dynamicList.filter(list => list.hasError === true);
    const hasErrors = listsWithErrors.length > 0;
    const message = listsWithErrors.length === 0 ? '' : listsWithErrors[0].message;
    const newDynamicListWrapper = renderDynamicList(deleteAction, dynamicList, labelText, placeholder, hasErrors, message);
    const buttonsWrapper = findElement('buttonsWrapper');
    buttonsWrapper.insertAdjacentElement('beforebegin', newDynamicListWrapper);
}


// Get form data
// -----------------------------------------------------------------------------
export function getFormData() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    return formData;
}


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
    const data = await response.json();

    if (!data.success && data.error) window.location.href = '/view/errorPage.php';
    else return data;
}