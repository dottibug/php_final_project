import {fetchBoards} from "../../fetch/fetchBoards.js";
import {fetchCurrentBoardLists} from "../../fetch/fetchCurrentBoardLists.js";
import {handleCloseLightbox} from "../lightbox/renderLightbox.js";
import {renderCreateBoardLists} from "./renderCreateBoardLists.js";
import {renderLightboxFormFields} from "../lightbox/renderLightboxFormFields.js";

// ------------------------------------
// EVENT: Create board
// ------------------------------------
export async function handleCreateBoard(e) {
    e.preventDefault();

    // Get the form data
    const form = document.getElementById('lightboxForm');
    const formButton = document.getElementById('createBoardButton');
    const formData = new FormData(form, formButton);

    // Create URL search params
    const params = new URLSearchParams(formData);
    params.append('action', 'createBoard');

    // Fetch options
    const init = {
        method: 'POST',
        body: params,
    }

    // Fetch
    const response = await fetch('../fetch/createBoard.php', init);
    const data = await response.json();

    // Action on response
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
                renderCreateBoardLists(data.lists, listsContainer, true, list.message);
            }
        })
    }

    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
        handleCloseLightbox();
    }
}

// ------------------------------------
// EVENT: Add list
// ------------------------------------
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
    const response = await fetch('../fetch/createBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        const listsContainer = document.getElementById('startingLists')
        listsContainer.innerHTML = '';
        renderCreateBoardLists(data.lists, listsContainer);
    }
}

// ------------------------------------
// EVENT: Delete list
// ------------------------------------
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
    const response = await fetch('../fetch/createBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        const listsContainer = document.getElementById('startingLists')
        listsContainer.innerHTML = '';
        renderCreateBoardLists(data.lists, listsContainer);
    }
}