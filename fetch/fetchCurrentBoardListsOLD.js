import {renderBoardLists} from '../render/renderBoardLists.js';
import {handleShowBoardMenu} from "../render/boardMenu/handlersBoardMenuOLD.js";


export async function fetchCurrentBoardListsOLD() {
    const response = await fetch('../fetch/fetchCurrentBoardLists.php');
    const data = await response.json();

    console.log('fetch current boards data: ', data);
    const lists = Object.values(data['currentBoardLists'][0]['lists']);

    if (data.success) {
        renderBoardLists(lists);
    }
}