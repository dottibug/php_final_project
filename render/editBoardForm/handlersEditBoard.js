import {renderEditBoardLists} from "./renderEditBoardLists.js";
import {fetchBoards} from "../../fetch/fetchBoards.js";
import {fetchCurrentBoardLists} from "../../fetch/fetchCurrentBoardLists.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";

// EVENT: Add List
export async function handleAddList(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('lightboxForm');
    const formButton = document.getElementById('addNewListButton');
    const formData = new FormData(form, formButton);

    // Give new input field a temporary name
    const numLists = document.querySelectorAll('.startingListInput').length;
    const randomNumber = Math.floor(Math.random() * 10000);
    const tempName = `list${numLists + randomNumber}`;

    // Create URL search params
    const params = new URLSearchParams(formData);
    params.append('action', 'addList');
    params.append(tempName, '');

    // Fetch options
    const init = {
        method: 'POST',
        body: params,
    }

    // Fetch
    const response = await fetch('../fetch/editBoard.php', init);
    const data = await response.json();

    // Actions on success
    if (data.success) {
        const listsContainer = document.getElementById('startingLists')
        listsContainer.innerHTML = '';
        renderEditBoardLists(data.lists, listsContainer);
    }
}

// EVENT: Delete list
export async function handleDeleteList(e) {
    e.preventDefault();
    const listToDelete = e.target.closest('button').dataset.listName;

    // Get form data
    const form = document.getElementById('lightboxForm');
    const formButton = document.getElementById(listToDelete);
    const formData = new FormData(form, formButton);

    // Create URL search params
    const params = new URLSearchParams(formData);
    params.append('action', 'deleteList');
    params.append('listToDelete', listToDelete);

    // Fetch options
    const init = {
        method: 'POST',
        body: params,
    }

    // Fetch
    const response = await fetch('../fetch/editBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        const listsContainer = document.getElementById('startingLists')
        listsContainer.innerHTML = '';
        renderEditBoardLists(data.lists, listsContainer);
    }
}

// EVENT: Save changes
export async function handleSaveBoardChanges(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('lightboxForm');
    const formButton = document.getElementById(saveChangesToBoardButton);
    const formData = new FormData(form, formButton);

    // Create URL search params
    const params = new URLSearchParams(formData);
    params.append('action', 'saveChanges');

    // Fetch options
    const init = {
        method: 'POST',
        body: params,
    }

    // Fetch
    const response = await fetch('../fetch/editBoard.php', init);
    const data = await response.json();

    if (!data.success) {
        // If error is in the fields array, re-render the board details inputs
        data.fields.forEach((field) => {
            if (field.hasError) {
                const boardDetails = document.getElementById('boardDetails');
                boardDetails.innerHTML = '';
                renderLightboxFormFields(data.fields, boardDetails);
            }
        })

        // If error is in the lists array, re-render the lists
        data.lists.forEach((list) => {
            if (list.hasError) {
                const listsContainer = document.getElementById('startingLists')
                listsContainer.innerHTML = '';
                renderEditBoardLists(data.lists, listsContainer, true, list.message);
            }
        })
    }

    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}