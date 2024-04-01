import {renderCreateBoardForm} from "../render/createNewBoardForm/renderCreateBoardForm.js";
import {handleCloseLightbox} from "../render/lightbox/renderLightbox.js";

// EVENT: Handle creating a new board
export async function handleShowCreateBoardForm() {
    // URL encoded params
    const params = new URLSearchParams({'action': 'createBoardForm'});

    // Fetch options
    const init = {
        method: 'POST',
        body: params
    }

    // Fetch
    const response = await fetch('../fetch/createBoard.php', init);
    const data = await response.json();

    // Actions on response
    if (data.success) {
        renderCreateBoardForm(data.fields, data.lists, 'Create New Board');
    }
}

