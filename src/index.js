import {
    format,
    parseISO
} from "date-fns";
import {
    TodoList,
    LoL,
    removeTodoItem,
    addTodoItem
} from "./todo";
import {
    clearLocalStorage,
    populateStorage,
    loadStorage
} from "./storage"

//Features for completion of project:
//TODO: Add ability to edit and delete projects

//Important features:
//TODO: Add a 'miscellaneous' default list for any new users
//TODO: Add in a home view that shows all lists, clicking on a sidebar list will hide all other lists

//Future features:
//TODO: Add ability to expand & collapse projects in both project space and sidebar
//TODO: Add ability to sort items based on either dueDate or priority (ascending and descending)
//TODO: Add sidebar functionality
//TODO: Add in a history view
//TODO: Add a small notification modal for when you delete an item
//TODO: Generate modals dynamically
//TODO: Add ability to order projects using sidebar

//Small Fixes:
//TODO: Hide empty projects/lists when all items are complete
//TODO: Fix date not displaying in edit modal
//TODO: Fix priority not resetting when adding to a new list

const TodoItemInterface = (() => {
    let listIndex = null;
    let itemIndex = null;
    const completeItem = (listIndex, itemIndex) => {
        LoL[listIndex].todoList[itemIndex].isChecked = true;
    }
    const setListIndex = (index) => {
        listIndex = index;
    }
    const setItemIndex = (index) => {
        itemIndex = index;
    }
    const createItem = (name, notes, dueDate, priority) => {
        addTodoItem(listIndex, name, notes, priority, dueDate);
    }
    const editItem = (name, notes, dueDate, priority) => {
        const list = LoL[listIndex];
        list.todoList[itemIndex].name = name;
        list.todoList[itemIndex].notes = notes;
        list.todoList[itemIndex].priority = priority;
        if (dueDate) {
            list.todoList[itemIndex].dueDate = format(parseISO(dueDate), 'PPPP');
        }
    }
    const deleteItem = (listIndex, itemIndex) => {
        removeTodoItem(listIndex, itemIndex);
    }
    const createList = (name) => {
        const index = LoL.length;
        const newList = new TodoList(name, index);
        LoL.push(newList);
    }
    const editList = (name) => {
        LoL[listIndex].name = name;
    }
    const deleteList = (listIndex) => {
        LoL.splice(listIndex, 1);
    }

    return {
        setListIndex,
        setItemIndex,
        createItem,
        createList,
        completeItem,
        editItem,
        deleteItem,
        editList,
        deleteList
    }
})();


//This should probably be broken up into separate modules
const DOMController = (() => {
    //Variables
    let selectedPriority = 0;
    let editFlag = false;
    //Document Selectors
    const sidebarList = document.querySelector('.project-list');
    const projectContainer = document.querySelector('.project-container');
    //Button Selectors
    const addProjectBtn = document.querySelector('#addProject');
    const editProjectBtn = document.querySelector('#editProject');
    const saveProjectBtn = document.querySelector('#saveProject');
    const todoToggleBtn = document.querySelector('#viewToggle');
    const delLocalDataBtn = document.querySelector('#delLocalData');
    //Todo Modal
    const todoItemModal = document.querySelector('.modal-todo');
    const modalTitle = document.querySelector('.modal-title');
    const modalClose = document.querySelector('#T');
    const modalListClose = document.querySelector('#L');
    const uiNewName = document.querySelector('#newName');
    const uiNewNote = document.querySelector('#newNotes');
    const uiNewDueDate = document.querySelector('#newDueDate');
    const submitNewItem = document.querySelector('#submitNewItem');
    const uiDefPriority = document.querySelector('#dp');
    const uiLowPriority = document.querySelector('#lp');
    const uiMedPriority = document.querySelector('#mp');
    const uiHighPriority = document.querySelector('#hp');
    //List Modal
    const listModal = document.querySelector('.modal-list');
    const submiteNewList = document.querySelector('#submitNewList');
    const listNewName = document.querySelector('#newList');

    //Add handlers
    const uiAddHandlers = () => {
        //Control bar events
        addProjectBtn.addEventListener('click', toggleListModal);
        editProjectBtn.addEventListener('click', listener);
        saveProjectBtn.addEventListener('click', listener);
        todoToggleBtn.addEventListener('click', listener);
        delLocalDataBtn.addEventListener('click', clearLocalStorage);
        //Modal events
        modalClose.addEventListener('click', toggleItemModal);
        modalListClose.addEventListener('click', toggleListModal);
        submitNewItem.addEventListener('click', submitItem);
        submiteNewList.addEventListener('click', submitList);
        //Modal Priority selectors
        uiDefPriority.addEventListener('click', uiPrioritySelect);
        uiLowPriority.addEventListener('click', uiPrioritySelect);
        uiMedPriority.addEventListener('click', uiPrioritySelect);
        uiHighPriority.addEventListener('click', uiPrioritySelect);
    }
    const onPageLoad = () => {
        loadStorage();
        update();
    }
    //Updates DOM
    const update = () => {
        removeAllChildNodes(projectContainer);
        removeAllChildNodes(sidebarList);
        populateStorage();
        LoL.forEach(element => {
            loadProjects(element, uiCreateAddTodo(LoL.indexOf(element)));
            console.table(element.todoList);
        });
    }
    const loadProjects = (project, uiAddTask) => {
        let projIndex = LoL.indexOf(project);
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
        const projectToolTip = document.createElement('div');
        projectToolTip.classList.add("tooltip-project");
        project.todoList.forEach(element => {
            let itemIndex = project.todoList.indexOf(element);
            let identifier = LoL.indexOf(project).toString() + "-" + project.todoList.indexOf(element).toString();
            if (element.isChecked) {
                return;
            }
            const todoDiv = document.createElement('div');
            todoDiv.classList.add("todo-item");
            todoDiv.id = identifier;
            todoDiv.addEventListener('click', todoItemHandler);
            const leftDiv = document.createElement('div');
            const priorityMarker = document.createElement('span');
            priorityMarker.classList.add("priority-marker", uiAssignPriorityColors(element.priority));
            leftDiv.appendChild(priorityMarker);
            const wrapDiv = document.createElement('div');
            wrapDiv.textContent = element.name;
            wrapDiv.classList.add("tooltip-right");
            const notesDiv = document.createElement('div');
            notesDiv.classList.add("notes");
            notesDiv.textContent = element.notes;
            const dueDateDiv = document.createElement('div');
            dueDateDiv.textContent = element.dueDate;
            wrapDiv.appendChild(notesDiv);
            wrapDiv.appendChild(uiCreateToolTip(projIndex, itemIndex));
            leftDiv.appendChild(wrapDiv)
            todoDiv.appendChild(leftDiv);
            todoDiv.appendChild(dueDateDiv);
            projectContent.appendChild(todoDiv);
        });
        projectContent.appendChild(uiAddTask);
        projectToolTip.appendChild(projectHeader);
        projectToolTip.appendChild(uiCreateProjectToolTip(projIndex));
        projectDiv.appendChild(projectToolTip);
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
    //Handles selection of priority in todoItem modal
    const uiPrioritySelect = (event) => {
        let eventId = event;
        if (typeof (event) == "object") {
            eventId = event.currentTarget.id;
        } else {
            switch (eventId) {
                case 0:
                    eventId = 'dp';
                    break;
                case 1:
                    eventId = 'lp'
                    break;
                case 2:
                    eventId = 'mp'
                    break;
                case 3:
                    eventId = 'hp'
                    break;
                default:
                    eventId = 'dp'
                    break;
            }
        }
        switch (eventId) {
            case 'dp':
                uiUnselectAllPriority();
                uiDefPriority.classList.add("priority-selected");
                setSelectedPriority(0);
                break;
            case 'lp':
                uiUnselectAllPriority();
                uiLowPriority.classList.add("priority-selected");
                setSelectedPriority(1);
                break;
            case 'mp':
                uiUnselectAllPriority();
                uiMedPriority.classList.add("priority-selected");
                setSelectedPriority(2);
                break;
            case 'hp':
                uiUnselectAllPriority();
                uiHighPriority.classList.add("priority-selected");
                setSelectedPriority(3);
                break;
            default:
                uiUnselectAllPriority();
                uiDefPriority.classList.add("priority-selected");
                setSelectedPriority(0);
                break;
        }
    }
    const uiUnselectAllPriority = () => {
        uiDefPriority.classList.remove("priority-selected");
        uiLowPriority.classList.remove("priority-selected");
        uiMedPriority.classList.remove("priority-selected");
        uiHighPriority.classList.remove("priority-selected");
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
    //Creates edit and delete tooltip for todoItems
    const uiCreateToolTip = (projIndex, itemIndex) => {
        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add("tooltiptext");
        const editButton = document.createElement('button');
        const delButton = document.createElement('button');
        const editSpan = document.createElement('span');
        const delSpan = document.createElement('span');
        editSpan.textContent = "edit";
        delSpan.textContent = "delete";
        editSpan.classList.add("material-symbols-outlined");
        delSpan.classList.add("material-symbols-outlined");
        editButton.id = 'E' + projIndex.toString() + itemIndex.toString();
        delButton.id = 'D' + projIndex.toString() + itemIndex.toString();
        editButton.addEventListener('click', tooltipEditHandler);
        delButton.addEventListener('click', tooltipDeleteHandler);
        editButton.appendChild(editSpan);
        delButton.appendChild(delSpan);
        tooltipSpan.appendChild(editButton);
        tooltipSpan.appendChild(delButton);
        return (tooltipSpan);
    }
    //Creates edit and delete tooltip for todoLists
    const uiCreateProjectToolTip = (projIndex) => {
        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add("tooltiptext");
        const editButton = document.createElement('button');
        const delButton = document.createElement('button');
        const editSpan = document.createElement('span');
        const delSpan = document.createElement('span');
        editSpan.textContent = "edit";
        delSpan.textContent = "delete";
        editSpan.classList.add("material-symbols-outlined");
        delSpan.classList.add("material-symbols-outlined");
        editButton.id = 'EP' + projIndex.toString();
        delButton.id = 'DP' + projIndex.toString();
        editButton.addEventListener('click', tooltipEditHandlerProject);
        delButton.addEventListener('click', tooltipDeleteHandlerProject);
        editButton.appendChild(editSpan);
        delButton.appendChild(delSpan);
        tooltipSpan.appendChild(editButton);
        tooltipSpan.appendChild(delButton);
        return (tooltipSpan);
    }
    //Handles modals (could use refactoring)
    const uiModalControl = (event) => {
        let ref = event.currentTarget.id; //This id will allow us to know which List to add the todo
        ref = ref.replace(/\D/g, ''); //regex for dropping all characters that arent numbers
        uiCreateListName(ref);
        TodoItemInterface.setListIndex(ref);
        toggleItemModal();
    }
    const toggleItemModal = () => {
        todoItemModal.classList.toggle("show-modal");
        clearModalInputs();
    }
    const toggleListModal = () => {
        listModal.classList.toggle("show-modal");
        clearModalInputs();
    }
    const loadEditModal = (listIndex, itemIndex) => {
        const list = LoL[listIndex];
        uiNewName.value = list.todoList[itemIndex].name;
        uiNewNote.value = list.todoList[itemIndex].notes;
        uiNewDueDate.value = parseISO(list.todoList[itemIndex].dueDate); //Fix this
        uiPrioritySelect(list.todoList[itemIndex].priority);
    }
    const loadEditModalProject = (listIndex) => {
        listNewName.value = LoL[listIndex].name;
    }
    const clearModalInputs = () => {
        if (!getEditFlag()) {
            //Todo modal
            uiNewName.value = "";
            uiNewNote.value = "";
            uiNewDueDate.value = "";
            //List modal
            listNewName.value = "";
            uiUnselectAllPriority();
        } else {
            return;
        }
    }
    //Submits todoItem data
    const submitItem = () => {
        if (uiNewName.value == "") {
            alert("Please enter a name.");
        } else {
            const newPriority = getSelectedPriority();
            if (getEditFlag()) {
                TodoItemInterface.editItem(uiNewName.value, uiNewNote.value, uiNewDueDate.value, newPriority);
                setEditFlag(false);
            } else {
                TodoItemInterface.createItem(uiNewName.value, uiNewNote.value, uiNewDueDate.value, newPriority);
            }
            update();
            toggleItemModal();
        }

    }
    //Submits todoList data
    const submitList = () => {
        if (listNewName.value == "") {
            alert("Please enter a name.")
        } else {
            if(getEditFlag()){
                TodoItemInterface.editList(listNewName.value);
                setEditFlag(false);
            }
            else{
                TodoItemInterface.createList(listNewName.value);
            }
            update();
            toggleListModal();
        }
    }

    //Handles completion event for todoItems
    const todoItemHandler = (event) => {
        const arr = event.currentTarget.id.split('-');
        const listIndex = arr[0];
        const itemIndex = arr[1];
        TodoItemInterface.completeItem(listIndex, itemIndex);
        update();
    }
    //Handles events from tooltips on todoItems
    const tooltipEditHandler = (event) => {
        event.stopPropagation();
        setEditFlag(true);
        let ref = event.currentTarget.id; //This id will allow us to know which List to add the todo
        ref = ref.replace(/\D/g, '');
        const arr = ref.split(''); //First item is listIndex second is todoList index
        uiCreateListName(arr[0], 1);
        TodoItemInterface.setListIndex(arr[0]); //This is important for selecting the right list
        TodoItemInterface.setItemIndex(arr[1]);
        loadEditModal(arr[0], arr[1]);
        toggleItemModal();
    }
    const tooltipDeleteHandler = (event) => {
        event.stopPropagation();
        let ref = event.currentTarget.id; //This id will allow us to know which List to add the todo
        ref = ref.replace(/\D/g, '');
        const arr = ref.split("");
        TodoItemInterface.deleteItem(arr[0], arr[1]);
        update();
    }
    //Generates modal title based on editing or adding todoItem
    const uiCreateListName = (listIndex, selector) => {
        const listName = document.createElement('span');
        listName.classList.add("list-name");
        console.log(listIndex);
        listName.textContent = LoL[listIndex].name;
        if (selector == 1) {
            modalTitle.textContent = "Editing item in ";
            modalTitle.appendChild(listName);
        } else {
            modalTitle.textContent = "New item for ";
            modalTitle.appendChild(listName);
        }
    }
    const tooltipEditHandlerProject = (event) => {
        event.stopPropagation();
        setEditFlag(true);
        let ref = event.currentTarget.id; //This id will allow us to know which List to add the todo
        ref = ref.replace(/\D/g, '');
        //uiCreateListName(arr[0], 1); 
        TodoItemInterface.setListIndex(ref); //This is important for selecting the right list
        loadEditModalProject(ref);
        toggleListModal();
    }
    const tooltipDeleteHandlerProject = (event) => {
        event.stopPropagation();
        let ref = event.currentTarget.id; //This id will allow us to know which List to add the todo
        ref = ref.replace(/\D/g, '');
        console.log(ref);
        TodoItemInterface.deleteList(ref);
        update();
    }
    //Setters and getters
    const setEditFlag = (bool) => {
        editFlag = bool;
    }
    const getEditFlag = () => {
        return (editFlag)
    }
    const setSelectedPriority = (priorityVal) => {
        selectedPriority = priorityVal;
    }
    const getSelectedPriority = () => {
        return (selectedPriority);
    }
    return {
        update,
        uiAddHandlers,
        onPageLoad
    };
})();
DOMController.uiAddHandlers();
DOMController.onPageLoad();


function listener(event) {
    event.stopPropagation();
    console.log('Button Clicked');
    DOMController.update();

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}