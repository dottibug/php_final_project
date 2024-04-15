import {fetchData, refresh} from "../render/forms/formHandlers.js";

// Board selection
// -----------------------------------------------------------------------------------
export async function sidebarBoardSelection(boardID) {
    // Fetch
    const action = 'updateCurrentBoardID';
    const res = await fetchData(action, {}, {'newBoardID': boardID});
    if (res.success) await refresh(true, true, false);
}