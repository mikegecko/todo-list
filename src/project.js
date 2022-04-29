//This is a factory for creating/modifying/deleting projects

const Project = function({name, index, todoList}){
    this.name = name || "";
    this.index = index || 0;
    this.todoList = todoList;
}