// JS functions to handle AJAX (fetch API)

import {fetchBoards} from './fetchBoards.js';
import {fetchCurrentBoardLists} from './fetchCurrentBoardLists.js';

// After document is loaded, fetch the user's boards and current board lists
document.addEventListener('DOMContentLoaded', async function () {
    await fetchBoards();
    await fetchCurrentBoardLists();
});





