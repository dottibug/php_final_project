import {hideTaskMenu, handleTaskMenuSelection} from "../../eventHandlers/taskMenuHandlers.js";
import {createElement, findElement} from "../uiElements/elements.js";

// 'Tasks' menu
// -----------------------------------------------------------------------------
export function renderTaskMenu(taskID) {
    // Task
    const taskElement = findElement(taskID);

    // Menu <div>
    const taskMenu = createElement('div', 'menu taskMenu', `taskMenu${taskID}`);
    taskMenu.addEventListener('mouseleave', (e) => hideTaskMenu(e));
    taskMenu.addEventListener('click', (e) => handleTaskMenuSelection(e), false);

    // Menu nav <ul>
    const taskMenuNav = createElement('ul', 'taskMenuNav');

    // Edit task <li>
    const editTask = createElement('li', 'taskMenuNavItem', '', 'Edit Task');
    editTask.dataset.taskId = taskID;
    editTask.dataset.action = 'editTaskForm';

    // Delete task <li>
    const deleteTask = createElement('li', 'taskMenuNavItem deleteTask', '', 'Delete Task');
    deleteTask.dataset.taskId = taskID;
    deleteTask.dataset.action = 'deleteTaskWarning';

    // Compose
    taskElement.appendChild(taskMenu);
    taskMenu.appendChild(taskMenuNav);
    taskMenuNav.appendChild(editTask);
    taskMenuNav.appendChild(deleteTask);
}