import {renderEmptyBoard} from "./renderPlaceholders.js";
import {renderLists} from "./renderLists.js";
import {clearElement} from "../uiElements/clearElement.js";

export function renderBoardLists(lists) {
    // Clear canvas
    clearElement('canvas');

    // Render empty board or lists
    lists.length === 0 ? renderEmptyBoard() : renderLists(lists);
}