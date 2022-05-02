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
    format
} from "date-fns";

//TODO: Setup storage methods for fetching and setting JSON data in localStorage
//TODO: Fix due date display format
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
    this.removeTodoItem = function (id) {
        this.todoList.splice(id, 1);
        this.updateId();
    }
    this.updateId = function () {
        this.todoList.forEach(element => {
            element.id = this.todoList.indexOf(element);
        });
    }
}
//TodoItem Constructor
function TodoItem(name, id, dueDate, notes, priority, isChecked) {
    this.name = name || "";
    this.dueDate = dueDate || format(startOfToday(),'PPPP'); //Figure out how to format dueDate
    this.notes = notes || "";
    this.priority = priority || 0;
    this.isChecked = isChecked || false;
    this.id = id;
}
//Testing values & methods
const LoL = []; //List of Lists
const defaultList = new TodoList("Default", LoL.length);
LoL.push(defaultList);
defaultList.addTodoItem("Clean Room", "Use vacuum", 1, format(startOfTomorrow(), 'PPPP'));
defaultList.addTodoItem("Play games", "Minecraft", 2);
defaultList.addTodoItem("Play games", "Minecraft", 3);
defaultList.addTodoItem("Play games", "Minecraft", 4);
defaultList.removeTodoItem(2);
console.table(defaultList.todoList);


export {
    TodoList,
    TodoItem,
    LoL
}