// Todo factory
/*
                    Project-----------------------
                        ||                      ||
                    TodoList----------------   Name
                        ||                ||      
        [-----------TodoItem--------]  ...Todo Items     
        |   |       |     |        |
      name duedate notes priority isChecked
*/  
const TodoItem = ({name, dueDate, notes, priority, isChecked}) => {
    this.name = name || "";
    this.dueDate = dueDate || newDate(); //This probably wont work
    this.notes = notes || "";
    this.priority = priority || 0;
    this.isChecked = isChecked || false;
}

