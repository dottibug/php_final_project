import {fetchData} from "../render/forms/formHandlers.js";
import {renderForm} from "../render/forms/renderForm.js";

// Hide the task menu
// -----------------------------------------------------------------------------------
export function hideTaskMenu(e) {
    const taskMenu = e.target;
    taskMenu.remove();
}

// Handle task menu selection
// -----------------------------------------------------------------------------------
export async function handleTaskMenuSelection(e) {
    e.stopPropagation();

    // Fetch
    const action = e.target.closest('li').dataset.action;
    const taskID = e.target.closest('li').dataset.taskId;
    const res = await fetchData(action, {}, {'taskID': taskID});

    // Render
    if (res.success) {
        const {fields, lists, subtasks, task} = res.data || null;
        const {title} = task;
        if (action === 'editTaskForm') {
            const options = {
                heading: 'Edit Task',
                formName: 'editTask',
                fields,
                lists,
                subtasks,
                task
            };
            renderForm(options);
        }
        if (action === 'deleteTaskWarning') {
            const options = {heading: title, formName: action, task};
            renderForm(options);
        }
    }
}