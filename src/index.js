import {
    TodoItem,
    TodoList,
    LoL
} from "./todo";
/*
    Functions:
    view all projects/todos
    create todo/project
    expand todo to view/edit details(todo modal)
    delete todo/project
*/
//TODO: create 'add' button with unique id's for adding a todoItem to appropriate project/todoList -> will bring up add todo modal
//TODO: create 'edit' button that shows/hides when hovering over an editable element -> will bring up edit modal
//TODO: Add priority colors & implement checkboxes [1/2 Done]
//TODO: Add ability to expand & collapse projects in both project space and sidebar
//TODO: Create setter/getter functions for todoItems for interaction with DOM modals

//Maybe break this up into separate modules?
const DOMController = (() => {
    //Document Selectors
    const sidebarList = document.querySelector('.project-list');
    const projectContainer = document.querySelector('.project-container');
    //Button Selectors
    const addProjectBtn = document.querySelector('#addProject');
    const editProjectBtn = document.querySelector('#editProject');
    const delProjectBtn = document.querySelector('#delProject');
    const todoToggleBtn = document.querySelector('#viewToggle');
    const delLocalDataBtn = document.querySelector('#delLocalData');
    
    //Add handlers
    addProjectBtn.addEventListener('click', listener);
    editProjectBtn.addEventListener('click', listener);
    delProjectBtn.addEventListener('click', listener);
    todoToggleBtn.addEventListener('click', listener);
    delLocalDataBtn.addEventListener('click', listener);
    //This updates the DOM to reflect data stored locally(eventually)
    //Currently loads default project from todo.js
    const update = () => {
        removeAllChildNodes(projectContainer);
        removeAllChildNodes(sidebarList);
        LoL.forEach(element => {
            loadProjects(element, uiCreateAddTodo(element.id));
        });
    }
    const loadProjects = (project, uiAddTask) => {
        //Loads projects into sidebar
        const projectSidebar = document.createElement('li');
        projectSidebar.textContent = project.name;
        sidebarList.appendChild(projectSidebar);
        //Loads projects into main container
        const projectDiv = document.createElement('div');
        projectDiv.classList.add("project");
        const projectHeader = document.createElement('h2');
        projectHeader.textContent = project.name;
        const projectContent = document.createElement('div');
        projectContent.classList.add("project-content");

        project.todoList.forEach(element => {
            const todoDiv = document.createElement('div');
            todoDiv.classList.add("todo-item");
            const leftDiv = document.createElement('div');
            const priorityMarker = document.createElement('span');
            priorityMarker.classList.add("priority-marker", uiAssignPriorityColors(element.priority));
            //priorityMarker.textContent = "radio_button_unchecked";
            leftDiv.appendChild(priorityMarker);
            const wrapDiv = document.createElement('div');
            wrapDiv.textContent = element.name;
            const notesDiv = document.createElement('div');
            notesDiv.classList.add("notes");
            notesDiv.textContent = element.notes;
            const dueDateDiv = document.createElement('div');
            dueDateDiv.textContent = element.dueDate;
            wrapDiv.appendChild(notesDiv);
            leftDiv.appendChild(wrapDiv)
            todoDiv.appendChild(leftDiv);
            todoDiv.appendChild(dueDateDiv);
            projectContent.appendChild(todoDiv);
        });
        projectContent.appendChild(uiAddTask);
        projectDiv.appendChild(projectHeader);
        projectDiv.appendChild(projectContent);
        projectContainer.appendChild(projectDiv);
        return;
    }
    //Takes priority of todoItem and returns proper css class string
    const uiAssignPriorityColors = (priorityVal) => {
        const defP = "default-priority";
        const lowP = "low-priority";
        const medP = "medium-priority";
        const highP = "high-priority";
        switch (priorityVal) {
            case 0:
                return (defP);
                break;
            case 1:
                return (lowP);
                break;
            case 2:
                return (medP);
                break;
            case 3:
                return (highP);
                break;
            default:
                return (defP);
                break;
        }
    }
    //Creates Add button below each todo list with a unique id tying it to the proper list
    const uiCreateAddTodo = (projIndex) => {
        let id = "addTo" + projIndex;
        const addItem = document.createElement('div');
        addItem.classList.add("add-item");
        const spanAdd = document.createElement('span');
        spanAdd.classList.add("material-symbols-outlined","md-36");
        spanAdd.textContent = "add";
        addItem.appendChild(spanAdd);
        addItem.id = id;
        addItem.addEventListener('click', listener);
        return(addItem);
    }
    return {
        update
    };
})();

function listener() {
    console.log('Button Clicked');
    DOMController.update();
    
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}