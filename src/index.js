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
//TODO: Add ability to change item priority
//TODO: Add ability to create new lists/projects
//TODO: Add sidebar functionality
//TODO: create 'edit' button that shows/hides when hovering over an editable element -> will bring up edit modal
//TODO: Add ability to expand & collapse projects in both project space and sidebar

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
    //Todo Modal
    const todoItemModal = document.querySelector('.modal-todo');
    const modalClose = document.querySelector('#T');
    const modalListClose = document.querySelector('#L');
    const uiListName = document.querySelector('.list-name');
    const uiNewName = document.querySelector('#newName');
    const uiNewNote = document.querySelector('#newNotes');
    const uiNewDueDate = document.querySelector('#newDueDate');
    const submitNewItem = document.querySelector('#submitNewItem');
    //List Modal
    const listModal = document.querySelector('.modal-list');
    const submiteNewList = document.querySelector('#submitNewList');
    const listNewName = document.querySelector('#newList');

    //Add handlers
    const uiAddHandlers = () => {
        //Control bar events
        addProjectBtn.addEventListener('click', toggleListModal);
        editProjectBtn.addEventListener('click', listener);
        delProjectBtn.addEventListener('click', listener);
        todoToggleBtn.addEventListener('click', listener);
        delLocalDataBtn.addEventListener('click', listener);
        //Modal events
        modalClose.addEventListener('click', toggleItemModal);
        modalListClose.addEventListener('click', toggleListModal);
        submitNewItem.addEventListener('click', submitItem);
        submiteNewList.addEventListener('click', submitList);
    }
    //This updates the DOM to reflect data stored locally(eventually)
    //Currently loads default project from todo.js
    const update = () => {
        removeAllChildNodes(projectContainer);
        removeAllChildNodes(sidebarList);
        LoL.forEach(element => {
            loadProjects(element, uiCreateAddTodo(element.index));
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
    const uiCreateAddTodo = (listIndex) => {
        let id = "add" + listIndex;
        const addItem = document.createElement('div');
        addItem.classList.add("add-item");
        const spanAdd = document.createElement('span');
        spanAdd.classList.add("material-symbols-outlined", "md-36");
        spanAdd.textContent = "add";
        addItem.appendChild(spanAdd);
        addItem.id = id;
        addItem.addEventListener('click', uiModalControl);
        return (addItem);
    }
    //Handles modals 
    const uiModalControl = (event) => {
        let ref = event.currentTarget.id;
        ref = ref.replace(/\D/g, ''); //regex for dropping all characters that arent numbers
        console.log(ref); //This id will allow us to know which List to add the todo
        uiListName.textContent = LoL[ref].name;
        TodoItemInterface.setListIndex(ref);
        toggleItemModal(event);
    }
    const toggleItemModal = (event) => {
            todoItemModal.classList.toggle("show-modal");
            clearModalInputs();
    }
    const toggleListModal = (event) =>{
        listModal.classList.toggle("show-modal");
            clearModalInputs();
    }
    const clearModalInputs = () => {
        //Todo modal
        uiNewName.value = "";
        uiNewNote.value = "";
        uiNewDueDate.value = "";
        //List modal
        listNewName.value = "";
    }
    const submitItem = () => {
        if(uiNewName.value == ""){
            alert("Please enter a name.");
        }
        else{
            TodoItemInterface.createItem(uiNewName.value, uiNewNote.value, uiNewDueDate.value);
            update();
            toggleItemModal();
        }
        
    }
    const submitList = () => {
        if(listNewName.value == ""){
            alert("Please enter a name.")
        }
        else{
            TodoItemInterface.createList(listNewName.value);
            update();
            toggleListModal();
        }
    }
    return {
        update,
        uiAddHandlers
    };
})();
DOMController.uiAddHandlers();

const TodoItemInterface = (() => {
    let listIndex = null;

    const setListIndex = (index) => {
        listIndex = index;
    }
    const createItem = (name, notes, dueDate, priority) => {
        const list = LoL[listIndex];
        list.addTodoItem(name, notes, priority, dueDate);
    }
    const createList = (name) => {
        const index = LoL.length;
        const newList = new TodoList(name, index);
        LoL.push(newList);
    }
    return {
        setListIndex,
        createItem,
        createList
    }
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