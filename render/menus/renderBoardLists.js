import {handleTaskClick} from "../../eventHandlers/forms/taskHandlers.js";
import {showSortMenu} from "../../eventHandlers/menus/sortMenuHandlers.js";
import {getSubtasksCount} from "../uiElements/renderCheckboxList.js";
import {findElement} from "../uiElements/findElement.js";
import {createElement} from "../uiElements/createElement.js";

export function renderBoardLists(lists) {
    // Clear previous lists
    const listsContainer = findElement('listsContainer');
    listsContainer.innerHTML = '';

    // Render each list
    lists.forEach(list => {
        const {tasks, listID, color, title} = list;
        const numOfTasks = Object.keys(tasks).length;

        // List Wrapper
        const listWrapper = createElement('div', 'list', listID);

        // List header
        const listHeader = createElement('header', 'listHeader');

        // List heading wrapper
        const listHeadingWrapper = createElement('div', 'listHeadingWrapper', 'listHeadingWrapper');

        // Color bullet
        const colorBullet = createElement('span', 'iconCircle', '', '•');
        colorBullet.setAttribute('style', `color: ${color}`);

        // List heading
        const listHeading = createElement('h1', 'listTitle', '', `${title} (${numOfTasks})`);

        // 'Sort' button
        const sortButtonWrapper = createElement('div', 'sortButtonWrapper', 'sortButtonWrapper');
        const sortButton = createElement('button', 'sortButton');
        sortButton.title = 'Sort List';
        sortButton.dataset.listId = listID;
        sortButton.addEventListener('click', (e) => showSortMenu(e));

        // Tasks
        const tasksWrapper = renderTasks(tasks, listID, lists);

        // Compose board lists
        listsContainer.insertAdjacentElement('beforeend', listWrapper);
        listWrapper.appendChild(listHeader);
        listHeader.appendChild(listHeadingWrapper);
        listHeadingWrapper.appendChild(colorBullet);
        listHeadingWrapper.appendChild(listHeading);
        listHeader.appendChild(sortButtonWrapper);
        sortButtonWrapper.appendChild(sortButton);
        listWrapper.appendChild(tasksWrapper);
    });
}

function renderTasks(tasks, listID, lists) {
    // Tasks <ul>
    const tasksWrapper = createElement('ul', 'tasks', `tasks${listID}`);
    tasksWrapper.dataset.listId = listID;

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

    return tasksWrapper;
}