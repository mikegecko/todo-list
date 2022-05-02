/*
    Functions:
    view all projects/todos
    create todo/project
    expand todo to view/edit details(todo modal)
    delete todo/project
*/
import {
    TodoItem,
    TodoList,
    LoL
} from "./todo";

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
    //TODO: create 'add' button with unique id's for adding a todoItem to appropriate project/todoList -> will bring up add todo modal
    //TODO: create 'edit' button that shows/hides when hovering over an editable element -> will bring up edit modal
    //Add handlers
    addProjectBtn.addEventListener('click', listener);
    editProjectBtn.addEventListener('click', listener);
    delProjectBtn.addEventListener('click', listener);
    todoToggleBtn.addEventListener('click', listener);
    delLocalDataBtn.addEventListener('click', listener);
    //This updates the DOM to reflect data stored locally(eventually)
    //Currently loads default project from todo.js
    const update = () => {
        LoL.forEach(element => {
            createProject(element);
            console.log(element);
        });
    }
    const createProject = (project) => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add("project");
        const projectHeader = document.createElement('h2');
        projectHeader.textContent = project.name;
        const projectContent = document.createElement('div');
        projectContent.classList.add("project-content");

        project.todoList.forEach(element => {
            console.log(element);
            const todoDiv = document.createElement('div');
            todoDiv.classList.add("todo-item");
            const wrapDiv = document.createElement('div');
            wrapDiv.textContent = element.name;
            const notesDiv = document.createElement('div');
            notesDiv.classList.add("notes");
            notesDiv.textContent = element.notes;
            const dueDateDiv = document.createElement('div');
            dueDateDiv.textContent = element.dueDate;
            wrapDiv.appendChild(notesDiv);
            todoDiv.appendChild(wrapDiv);
            todoDiv.appendChild(dueDateDiv);
            projectContent.appendChild(todoDiv);
        });
        projectDiv.appendChild(projectHeader);
        projectDiv.appendChild(projectContent);
        projectContainer.appendChild(projectDiv);
        return;
    }
    return {
        update
    };
})();

function listener (){
    console.log('Button Clicked');
    DOMController.update();
}