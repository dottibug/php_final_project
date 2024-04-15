import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderAddTaskForm} from "./renderAddTaskForm.js";
import {renderCreateBoardForm} from "./renderCreateBoardForm.js";
import {renderEditBoardForm} from "./renderEditBoardForm.js";
import {renderDeleteBoardWarning} from "./renderDeleteBoardWarning.js";
import {renderTaskDetails} from "./renderTaskDetails.js";
import {renderEditTaskForm} from "./renderEditTaskForm.js";
import {renderDeleteTaskWarning} from "./renderDeleteTaskWarning.js";

// Renders forms based on options
// -----------------------------------------------------------------------------
export function renderForm(options) {
    const formName = options.formName;
    const heading = options.heading;
    const boardTitle = options.boardTitle || '';
    const refreshOnClose = options.refreshOnClose || false;
    const {fields, lists, subtasks, task, selectedItem} = options || {};

    console.log('options for render form: ', options);

    const lightbox = renderLightbox(heading, refreshOnClose);
    let form;

    switch (formName) {
        case 'createBoard':
            form = renderCreateBoardForm(fields, lists);
            break;
        case 'editBoard':
            form = renderEditBoardForm(fields, lists);
            break;
        case 'deleteBoardWarning':
            form = renderDeleteBoardWarning(boardTitle);
            break;
        case 'viewTask':
            form = renderTaskDetails(task, subtasks);
            break;
        case 'addTask':
            form = renderAddTaskForm(fields, lists, subtasks, selectedItem);
            break;
        case 'editTask':
            form = renderEditTaskForm(task, fields, lists, subtasks);
            break;
        case 'deleteTaskWarning':
            form = renderDeleteTaskWarning(task);
            break;
    }

    // Compose
    if (form) {
        lightbox.appendChild(form);
    }
}