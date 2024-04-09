import {renderDynamicList} from "../../render/uiElements/renderDynamicList.js";
import {fetchData} from "../../render/forms/formHandlers.js";
import {removeElement} from "../../render/uiElements/removeElement.js";
import {findElement} from "../../render/uiElements/findElement.js";

// Add list to the dynamic input list
// -----------------------------------------------------------------------------------
export async function addDynamicListItem(e, action, listLabel, placeholder, hasErrors, message) {
    e.preventDefault();

    // Fetch
    const form = findElement('form');
    const formData = new FormData(form);
    const tempName = getTempFieldName();
    const data = await fetchData(action, formData, {[tempName]: ''});

    // Render
    if (data.success) refreshDynamicList(data, action, listLabel, placeholder, hasErrors, message);

}

// Generate temporary field name for a newly added list input
// -----------------------------------------------------------------------------------
function getTempFieldName() {
    const numLists = document.querySelectorAll('.dynamicListInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    return `item${numLists + randomNumber}`;
}

// Delete list from the dynamic input list
// -----------------------------------------------------------------------------------
export async function deleteDynamicListItem(e, action, listLabel, placeholder, hasErrors, message) {
    e.preventDefault();

    // Fetch
    const form = findElement('form');
    const formData = new FormData(form);
    const itemToDelete = e.target.closest('button').dataset.listItemName;
    const data = await fetchData(action, formData, {'itemToDelete': itemToDelete});

    // Render
    if (data.success) refreshDynamicList(data, action, listLabel, placeholder, hasErrors, message);
}

// Refresh dynamic input list
// -----------------------------------------------------------------------------------
export function refreshDynamicList(data, action, listLabel, placeholder, hasErrors, message) {
    const list = (action === 'addList' || action === 'deleteList')
        ? data.lists : data.subtasks;

    const deleteAction = action === 'addList' ? 'deleteList' : 'deleteSubtask';

    removeElement('dynamicListWrapper');
    const dynamicList = renderDynamicList(deleteAction, list, listLabel, placeholder, hasErrors, message);

    const buttonsWrapper = findElement('buttonsWrapper');
    buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
}