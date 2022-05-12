// Todo factory
/*
   
  ┌────────────────────┐          ┌───────────────────┐
  │                    │          │                   │
  │   List of Lists    ├──────────┤     TodoList      ├───────── Name
  │                    │          │                   │
  └────────────────────┘          └──────────┬────────┘
                                             │
                                             │
                                  ┌──────────┴────────┐
                                  │                   │
                                  │     TodoItem      │
                                  │                   │
                                  └─┬──┬──┬──┬──┬─────┘
                                    │  │  │  │  │
                                    │  │  │  │  │
                              name ─┘  │  │  │  │
                                       │  │  │  │
                             dueDate ──┘  │  │  │
                                          │  │  │
                              notes ──────┘  │  │
                                             │  │
                             priority ───────┘  │
                                                │
                             isChecked ─────────┘

*/
import {
    startOfToday,
    startOfTomorrow,
    format,
    parse,
    parseISO,
    formatISO
} from "date-fns";

//TODO: write methods for deleting a TodoList
//TODO: Order/sort todoList array based on dueDate or priority
const LoL = []; //List of Lists
//TodoList Constructor
function TodoList(name, index, todoList) {
    this.name = name || "";
    this.index = index || 0;
    this.todoList = todoList || [];
    this.addTodoItem = function (name, notes, priority, dueDate, isChecked) {
        let newID = this.todoList.length;
        let newTodoItem = new TodoItem(name, newID, dueDate, notes, priority, isChecked)
        this.todoList.push(newTodoItem);
    }
}
//TodoItem Constructor
function TodoItem(name, id, dueDate, notes, priority, isChecked) {
    this.name = name || "";
    this.dueDate = dueDate ? format(parseISO(dueDate), 'PPPP') : format(startOfToday(), 'PPPP');
    this.notes = notes || "";
    this.priority = priority || 0;
    this.isChecked = isChecked || false;
    this.id = id;
}
function addTodoItem (listIndex, name, notes, priority, dueDate, isChecked){
    let newID = LoL[listIndex].todoList.length;
    let newTodoItem = new TodoItem(name, newID, dueDate, notes, priority, isChecked)
    LoL[listIndex].todoList.push(newTodoItem);
}
function removeTodoItem(listID, itemID) {
    LoL[listID].todoList.splice(itemID, 1);
    updateID(listID);
}

function updateID(listID) {
    LoL[listID].todoList.forEach(element => {
        element.id = LoL[listID].todoList.indexOf(element);
    });
}


export {
    TodoList,
    TodoItem,
    LoL,
    removeTodoItem,
    addTodoItem
}