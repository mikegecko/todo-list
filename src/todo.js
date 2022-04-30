// Todo factory
/*
                    Project-----------------------
                        ||                      ||
                Array TodoList----------------   Name
                        ||                ||      
        [-----------TodoItem--------]  ...Todo Items     
        |   |       |     |        |
      name duedate notes priority isChecked
*/  
const TodoItem = ({name, dueDate, notes, priority, isChecked, id}) => {
    this.name = name || "";
    this.dueDate = dueDate || newDate(); //This probably wont work
    this.notes = notes || "";
    this.priority = priority || 0;
    this.isChecked = isChecked || false;
    this.id = id;
}
//This todo list needs to go under a Project object
const todoList = [];
//Create a TodoItem and add it to todoList under proper Project
function addTodoItem (){
    let newItem = new TodoItem();
    todoList.push(newItem);
}