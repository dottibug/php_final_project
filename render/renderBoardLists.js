export function renderBoardLists(lists) {
    // Get lists container
    const listsContainer = document.getElementById('listsContainer');

    // Clear previous lists
    listsContainer.innerHTML = '';

    // List array from object
    const listsArray = Object.values(lists);

    // Render each list
    listsArray.forEach(list => {
        // Number of tasks
        const numOfTasks = Object.keys(list.tasks).length;

        // List <div> container
        const listContainer = document.createElement('div');
        listContainer.className = 'list';

        // List <header>
        const listHeader = document.createElement('header');
        listHeader.className = 'listHeader';

        // Color bullet <span>
        const colorBullet = document.createElement('span');
        colorBullet.className = 'iconCircle';
        colorBullet.setAttribute('style', `color: ${list.color}`);
        colorBullet.innerText = '•';

        // List <h1> heading
        const listHeading = document.createElement('h1');
        listHeading.className = 'listTitle';
        listHeading.innerText = `${list.title} (${numOfTasks})`;

        // Tasks <ul>
        const tasks = document.createElement('ul');
        tasks.className = 'tasks';

        // Tasks array from list
        const tasksArray = Object.values(list.tasks);

        // Render tasks
        tasksArray.forEach(task => {
            // Subtasks array from task
            const subtasksArray = Object.values(task.subtasks);

            // Count total subtasks and checked subtasks
            let total = 0;
            let checked = 0;
            subtasksArray.forEach(subtask => {
                if (subtask.status === 'checked') checked++;
                total++;
            });

            // Task <li> item
            const taskItem = document.createElement('li');
            taskItem.className = 'task';

            // Task <h1>
            const taskHeading = document.createElement('h1');
            taskHeading.className = 'taskTitle';
            taskHeading.innerText = task.title;

            // Subtasks summary <p>
            const subtaskSummary = document.createElement('p');
            subtaskSummary.className = 'taskProgress';
            subtaskSummary.innerText = `${checked} of ${total} subtasks`;

            // Compose tasks
            tasks.insertAdjacentElement('beforeend', taskItem);
            taskItem.appendChild(taskHeading);
            taskItem.appendChild(subtaskSummary);
        });

        // Compose board lists
        listsContainer.insertAdjacentElement('beforeend', listContainer);
        listContainer.appendChild(listHeader);
        listHeader.appendChild(colorBullet);
        listHeader.appendChild(listHeading);
        listContainer.appendChild(tasks);
    });
}