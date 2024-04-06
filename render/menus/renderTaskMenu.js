export function renderTaskMenu(taskID) {
    // Task
    const taskElement = document.getElementById(taskID);

    // Menu <div>
    const taskMenu = document.createElement('div');
    taskMenu.className = 'taskMenu';
    taskMenu.id = `taskMenu${taskID}`;

    // Menu nav <ul>
    const taskMenuNav = document.createElement('ul');
    taskMenuNav.className = 'taskMenuNav';

    // Edit task <li>
    const editTask = document.createElement('li');
    editTask.className = 'taskMenuNavItem';
    editTask.innerText = 'Edit Task';
    editTask.dataset['taskId'] = taskID;
    editTask.dataset['action'] = 'editTask';

    // Delete task <li>
    const deleteTask = document.createElement('li');
    deleteTask.className = 'taskMenuNavItem deleteTask';
    deleteTask.innerText = 'Delete Task';
    deleteTask.dataset['action'] = 'deleteTask';

    // Compose
    taskElement.appendChild(taskMenu);
    taskMenu.appendChild(taskMenuNav);
    taskMenuNav.appendChild(editTask);
    taskMenuNav.appendChild(deleteTask);
}