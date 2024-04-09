import {fetchData, refreshBoards} from "../../render/forms/formHandlers.js";

// Board selection
// -----------------------------------------------------------------------------------
export async function sidebarBoardSelection(boardID) {
    // Fetch
    const action = 'updateCurrentBoardID';
    const data = await fetchData(action, {}, {'newBoardID': boardID});

    // Render
    if (data.success) await refreshBoards();
}