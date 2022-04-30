//This is a factory for creating/modifying/deleting projects
const ProjectList = [];
const Project = function({name, index, todoList}){
    this.name = name || "";
    this.index = index || 0;
    this.todoList = todoList || [];
}
//
function createNewProject(name){
    let index = ProjectList.length;
    let newProject = new Project(name, index);
    ProjectList.push(newProject);
}