import {renderEmptyTaskBox} from "./renderPlaceholders.js";
import {getSubtasksCount} from "../uiComponents/renderCheckboxList.js";
import {handleTaskClick} from "../../eventHandlers/taskHandlers.js";
import {createElement} from "../uiComponents/elements.js";


// Render tasks
// -----------------------------------------------------------------------------
export function renderTasks(tasks, listID, lists) {
    // Tasks wrapper
    const tasksWrapper = createElement('ul', 'tasks', `tasks${listID}`);
    tasksWrapper.dataset.listId = listID;

    if (tasks.length === 0) {
        renderEmptyTaskBox('Add First Task', listID, tasksWrapper);
        return tasksWrapper;
    }

    // Tasks array from list
    const tasksArray = Object.values(tasks);

    tasksArray.forEach(task => {
        const {taskID, title} = task;
        const subtasks = Object.values(task.subtasks);
        const {total, checked} = getSubtasksCount(subtasks);

        // Task item
        const taskItem = createElement('li', 'task', taskID);
        taskItem.dataset.taskId = taskID;
        taskItem.dataset.action = 'viewTask';
        taskItem.dataset.taskTitle = title;
        taskItem.addEventListener('click', (e) => handleTaskClick(e, task, lists));

        // Task menu button
        const taskMenuButton = createElement('button', 'taskMenuButton');
        taskMenuButton.dataset['taskId'] = task.taskID;
        const taskMenuButtonIcon = createElement('span', 'material-symbols-outlined', '', 'more_horiz\n');
        taskMenuButton.appendChild(taskMenuButtonIcon);

        // Task heading
        const taskHeading = createElement('h1', 'taskTitle', '', title);

        // Subtasks summary <p>
        const summaryText = `${checked} of ${total} subtasks`;
        const subtaskSummary = createElement('p', 'taskProgress', '', summaryText);

        // Compose tasks
        tasksWrapper.insertAdjacentElement('beforeend', taskItem);
        taskItem.appendChild(taskMenuButton);
        taskItem.appendChild(taskHeading);
        taskItem.appendChild(subtaskSummary);
    });

    renderEmptyTaskBox('Add New Task', listID, tasksWrapper);
    return tasksWrapper;
}