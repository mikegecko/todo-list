//This is a factory for creating/modifying/deleting projects

const Project = function({name, index}){
    this.name = name || "";
    this.index = index || 0;

}