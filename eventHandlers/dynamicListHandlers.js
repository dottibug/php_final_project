import {renderDynamicList} from "../render/uiElements/renderDynamicList.js";
import {fetchData} from "../render/forms/formHandlers.js";
import {removeElement, findElement} from "../render/uiElements/elements.js";

// Add list to the dynamic input list
// -----------------------------------------------------------------------------------
export async function addDynamicListItem(e, action, listLabel, placeholder, hasErrors, message) {
    e.preventDefault();

    // Fetch
    const form = findElement('form');
    const formData = new FormData(form);
    const tempName = getTempFieldName();
    const res = await fetchData(action, formData, {[tempName]: ''});

    // Render
    if (res.success) refreshDynamicList(res.data, action, listLabel, placeholder, hasErrors, message);

}

// Generate temporary field name for a newly added list input
// -----------------------------------------------------------------------------------
export function getTempFieldName() {
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
    const res = await fetchData(action, formData, {'itemToDelete': itemToDelete});

    // Render
    if (res.success) refreshDynamicList(res.data, action, listLabel, placeholder, hasErrors, message);
}

// Refresh dynamic input list
// -----------------------------------------------------------------------------------
export function refreshDynamicList(data, action, listLabel, placeholder, hasErrors, message) {
    // Set which data is received (lists or subtasks)
    const list = (action === 'addList' || action === 'deleteList')
        ? data.lists : data.subtasks;

    // Set which delete action will be used when deleting items from the dynamic list
    const deleteAction = (action === 'addList' || action === 'deleteList') ? 'deleteList' : 'deleteSubtask';

    // Render dynamic list component
    removeElement('dynamicListWrapper');
    const dynamicList = renderDynamicList(deleteAction, list, listLabel, placeholder, hasErrors, message);

    // Where to render the dynamic list
    const buttonsWrapper = findElement('buttonsWrapper');
    buttonsWrapper.insertAdjacentElement('beforebegin', dynamicList);
}