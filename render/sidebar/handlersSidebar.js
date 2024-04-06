import {fetchBoards, fetchCurrentBoardLists} from "../../fetch/script.js";

// -----------------------------------------------------------------------------
// EVENT: Select board in sidebar navigation
// -----------------------------------------------------------------------------
export async function handleBoardClick(boardID) {
    const params = new URLSearchParams({
        'action': 'updateCurrentBoardID',
        'newBoardID': boardID
    });

    const fetchOptions = {
        method: 'POST',
        body: params
    }

    const response = await fetch('../fetch/fetchController.php', fetchOptions);
    const data = await response.json();

    // Re-fetch boards and current board lists
    if (data.success) {
        await fetchBoards();
        await fetchCurrentBoardLists();
    }
}