import {renderBoardLists} from '../render/renderBoardLists.js';
import {handleShowBoardMenu} from "../render/boardMenu/handlersBoardMenu.js";


export async function fetchCurrentBoardLists() {
    const response = await fetch('../fetch/fetchCurrentBoardLists.php');
    const data = await response.json();
    
    if (data.success) {
        const lists = data['currentBoardLists'][0]['lists'];
        renderBoardLists(lists);
    }
}