import {renderEmptyBoard} from "./renderPlaceholders.js";
import {renderLists} from "./renderLists.js";
import {clearElement} from "../uiComponents/elements.js";

// Render board lists or empty board
// -----------------------------------------------------------------------------
export function renderBoardLists(lists) {
    // Clear canvas
    clearElement('canvas');

    // Render empty board or lists
    lists.length === 0 ? renderEmptyBoard() : renderLists(lists);
}