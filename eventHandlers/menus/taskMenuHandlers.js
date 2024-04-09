import {fetchData} from "../../render/forms/formHandlers.js";
import {renderForm} from "../../render/forms/renderForm.js";

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
    const data = await fetchData(action, {}, {'taskID': taskID});
    
    // Render
    if (data.success) {
        const {fields, lists, subtasks, task} = data || null;
        const {title} = task;
        if (action === 'editTaskForm') renderForm('Edit Task', 'editTask', fields, lists, subtasks, '', task);
        if (action === 'deleteTaskWarning') renderForm(title, action, null, null, null, '', task);
    }
}