// Todo factory
/*
                    Project <--not needed
                        ||                      
                Array TodoList------------------------------
                        ||                ||              ||
        [-----------TodoItem--------]  ...Todo Items     Name
        |   |       |     |        |
      name duedate notes priority isChecked
*/  
//TodoList Constructor
function TodoList(name, index, todoList){
    this.name = name || "";
    this.index = index || 0;
    this.todoList = todoList || [];
    this.addTodoItem = function (name, dueDate, notes, priority, isChecked){
        let newID = this.todoList.length;
        let newTodoItem = new TodoItem(name, newID, dueDate, notes, priority, isChecked)
        this.todoList.push(newTodoItem);
    }
}
//TodoItem Constructor
function TodoItem(name, id, dueDate, notes, priority, isChecked){
    this.name = name || "";
    this.dueDate = dueDate || newDate(); //This probably wont work
    this.notes = notes || "";
    this.priority = priority || 0;
    this.isChecked = isChecked || false;
    this.id = id;
}
const defaultList = new TodoList("Default", 0);
defaultList.addTodoItem("Clean Room",Date.now(),"Use vacuum", 1, false);
console.table(defaultList.todoList);


export{
    TodoList,TodoItem
}

