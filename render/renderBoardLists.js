import {fetchData, handleTaskClick, refreshBoards, closeOtherMenus} from "./forms/formHandlers.js";

export function renderBoardLists(lists) {
    // Get lists container
    const listsContainer = document.getElementById('listsContainer');

    // Clear previous lists
    listsContainer.innerHTML = '';

    // Render each list
    lists.forEach(list => {
        const {tasks, listID, color, title} = list;

        console.log('listID: ', listID);

        // Number of tasks
        const numOfTasks = Object.keys(tasks).length;

        // List <div> container
        const listContainer = document.createElement('div');
        listContainer.className = 'list';
        listContainer.id = listID;

        // List <header>
        const listHeader = document.createElement('header');
        listHeader.className = 'listHeader';

        // List heading wrapper
        const listHeadingWrapper = document.createElement('listHeadingWrapper');
        listHeadingWrapper.className = 'listHeadingWrapper';

        // Color bullet <span>
        const colorBullet = document.createElement('span');
        colorBullet.className = 'iconCircle';
        colorBullet.setAttribute('style', `color: ${color}`);
        colorBullet.innerText = '•';

        // List <h1> heading
        const listHeading = document.createElement('h1');
        listHeading.className = 'listTitle';
        listHeading.innerText = `${title} (${numOfTasks})`;

        // 'Sort' button
        const sortButtonWrapper = document.createElement('div');
        sortButtonWrapper.className = 'sortButtonWrapper';
        const sortButton = document.createElement('button');
        sortButton.className = 'sortButton';
        sortButton.title = 'Sort List';
        sortButton.dataset.listId = listID;
        sortButton.addEventListener('click', (e) => showSortMenu(e));

        // Tasks
        const tasksWrapper = renderTasks(tasks, listID, lists);

        // Compose board lists
        listsContainer.insertAdjacentElement('beforeend', listContainer);
        listContainer.appendChild(listHeader);
        listHeader.appendChild(listHeadingWrapper);
        listHeadingWrapper.appendChild(colorBullet);
        listHeadingWrapper.appendChild(listHeading);
        listHeader.appendChild(sortButtonWrapper);
        sortButtonWrapper.appendChild(sortButton);
        listContainer.appendChild(tasksWrapper);
    });
}

function showSortMenu(e) {
    const listID = e.target.closest('button').dataset.listId;
    const sortMenu = document.getElementById(`sortMenu${listID}`);

    if (sortMenu) sortMenu.remove();
    else {
        closeOtherMenus();
        renderSortMenu(listID);
    }
}

function renderSortMenu(listID) {
    const listElement = document.getElementById(listID);

    // Menu <div>
    const sortMenu = document.createElement('div');
    sortMenu.className = 'menu sortMenu';
    sortMenu.id = `sortMenu${listID}`;

    // Menu nav <ul>
    const sortMenuNav = document.createElement('ul');
    sortMenuNav.className = 'sortMenuNav';

    // Sort by newest <li>
    const sortByNewest = document.createElement('li');
    sortByNewest.className = 'sortMenuNavItem';
    sortByNewest.innerText = 'Sort by newest';
    sortByNewest.dataset.listId = listID;
    sortByNewest.dataset.action = 'newest';
    sortByNewest.addEventListener('click', (e) => handleSortTasks(e));

    // Sort by oldest <li>
    const sortByOldest = document.createElement('li');
    sortByOldest.className = 'sortMenuNavItem';
    sortByOldest.innerText = 'Sort by oldest';
    sortByOldest.dataset.listId = listID;
    sortByOldest.dataset.action = 'oldest';
    sortByOldest.addEventListener('click', (e) => handleSortTasks(e));

    // Compose
    listElement.appendChild(sortMenu);
    sortMenu.appendChild(sortMenuNav);
    sortMenuNav.appendChild(sortByNewest);
    sortMenuNav.appendChild(sortByOldest);
}

async function handleSortTasks(e) {
    // Fetch
    const action = e.target.dataset.action;
    const listID = e.target.dataset.listId;
    const data = await fetchData(action, {}, {'listID': listID});

    if (data.success) {
        // Remove sort menu
        const sortMenu = document.getElementById(`sortMenu${listID}`);
        sortMenu.remove();

        await refreshBoards();
    }
}

function renderTasks(tasks, listID, lists) {
    // Tasks <ul>
    const tasksWrapper = document.createElement('ul');
    tasksWrapper.className = 'tasks';
    tasksWrapper.id = `tasks${listID}`;
    tasksWrapper.dataset.listId = listID;

    // Tasks array from list
    const tasksArray = Object.values(tasks);

    tasksArray.forEach(task => {
        // Subtasks array from task
        const subtasks = Object.values(task.subtasks);

        // Count total subtasks and checked subtasks
        let total = 0;
        let checked = 0;
        subtasks.forEach(subtask => {
            if (subtask.status === 'checked') checked++;
            total++;
        });

        // Task <li> item
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        taskItem.id = task.taskID;
        taskItem.dataset['taskId'] = task.taskID;
        taskItem.dataset.action = 'viewTask';
        taskItem.addEventListener('click', (e) => handleTaskClick(e, task, lists));

        // Task menu <button>
        const taskMenuButton = document.createElement('button');
        taskMenuButton.className = 'taskMenuButton';
        taskMenuButton.dataset['taskId'] = task.taskID;
        const taskMenuButtonIcon = document.createElement('span');
        taskMenuButtonIcon.innerText = 'more_horiz\n';
        taskMenuButtonIcon.className = 'material-symbols-outlined';
        taskMenuButton.appendChild(taskMenuButtonIcon);

        // Task <h1>
        const taskHeading = document.createElement('h1');
        taskHeading.className = 'taskTitle';
        taskHeading.innerText = task.title;

        // Subtasks summary <p>
        const subtaskSummary = document.createElement('p');
        subtaskSummary.className = 'taskProgress';
        subtaskSummary.innerText = `${checked} of ${total} subtasks`;

        // Compose tasks
        tasksWrapper.insertAdjacentElement('beforeend', taskItem);
        taskItem.appendChild(taskMenuButton);
        taskItem.appendChild(taskHeading);
        taskItem.appendChild(subtaskSummary);
    });

    return tasksWrapper;
}