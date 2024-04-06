import {renderLightbox} from "../lightbox/renderLightbox.js";
import {renderAddTaskForm} from "./renderAddTaskForm.js";
import {renderNewBoardForm} from "./renderNewBoardForm.js";
import {renderEditBoardForm} from "./renderEditBoardForm.js";
import {renderDeleteBoardWarning} from "./renderDeleteBoardWarning.js";
import {renderViewTask} from "./renderViewTask.js";
import {renderEditTaskForm} from "./renderEditTaskForm.js";
import {renderDeleteTaskWarning} from "./renderDeleteTaskWarning.js";

export function renderForm(heading, formName, fields = null, lists = null, subtasks = null, boardTitle = '', task = null) {
    const lightbox = renderLightbox(heading);
    let form;

    switch (formName) {
        case 'createBoard':
            form = renderNewBoardForm(fields, lists);
            break;
        case 'editBoard':
            form = renderEditBoardForm(fields, lists);
            break;
        case 'deleteBoardWarning':
            form = renderDeleteBoardWarning(boardTitle);
            break;
        case 'viewTask':
            form = renderViewTask(task, subtasks);
            break;
        case 'addTask':
            form = renderAddTaskForm(fields, lists, subtasks);
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