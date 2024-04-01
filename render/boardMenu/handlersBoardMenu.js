import {renderBoardMenu} from "./renderBoardMenu.js";
import {renderDeleteBoardWarning} from "./renderDeleteBoardWarning.js";
import {renderEditBoardForm} from "../editBoardForm/renderEditBoardForm.js";

// EVENT: Show board menu
export function handleShowBoardMenu() {
    const boardMenu = document.getElementById('boardMenu');

    if (boardMenu) {
        // Close board menu if it's already open
        boardMenu.remove();
    } else {
        // Show board menu if it's not open
        renderBoardMenu();
    }

}

// EVENT: Delete board
export async function handleDeleteBoard() {
    // Fetch params
    const params = new URLSearchParams({'action': 'deleteBoard'});

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/deleteBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        // Reload to re-fetch the user's updated boards
        window.location.reload();
    }
}

// EVENT: Show warning for user to confirm board deletion
export async function handleShowDeleteBoardWarning() {
    // Fetch params
    const params = new URLSearchParams({'action': 'confirmDelete'});

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/deleteBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        const boardTitle = data.boardTitle;

        // Remove the board menu
        const boardMenu = document.getElementById('boardMenu');
        boardMenu.remove();

        // Render warning message
        renderDeleteBoardWarning(boardTitle);
    }
}

// EVENT: Edit board
export async function handleShowEditBoardForm() {
    // Fetch params
    const params = new URLSearchParams({'action': 'showEditBoardForm'});

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/editBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        // Remove the board menu
        const boardMenu = document.getElementById('boardMenu');
        boardMenu.remove();

        renderEditBoardForm(data.fields, data.lists);
    }
}
