//Detects whether localStorage is supported and available
//Used by calling either:

import {
    LoL,
    TodoList,
    TodoItem
} from "./todo";

//  storageAvailable('localStorage') or storageAvailable('sessionStorage')
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
//Methods for setting and getting objects/arrays
Storage.prototype.setObject = function (key, object) {
    return this.setItem(key, JSON.stringify(object))
}
Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
}

function clearLocalStorage() {
    localStorage.clear();
}
//Saves data to storage
function populateStorage() {
    localStorage.setObject('projects', LoL);
}
//Loads storage data into objects
function loadStorage() {
    let jsonList = localStorage.getObject('projects');
    if (jsonList == null) {
        const defaultList = new TodoList("Default Project", LoL.length);
        LoL.push(defaultList);
        defaultList.addTodoItem("Clean Room", "Use vacuum", 1);
        defaultList.addTodoItem("Play games", "Minecraft", 2);
        defaultList.addTodoItem("Play games", "No Man's Sky", 3);
        defaultList.addTodoItem("Play games", "Apex Legends", 4);
    } else {
        jsonList.forEach(item => {
            for (const key in TodoList) {
                if (Object.hasOwnProperty.call(TodoList, key)) {
                    item[key] = TodoList[key];
                }
            }
            LoL.push(item);
        });
    }

    // jsonList.forEach(element => {
    //     Object.assign(element, TodoList);
    //     element.todoList.forEach(item => {
    //         Object.assign(item, TodoItem);
    //     });
    //     LoL.push(element);
    // });

}

function testingStorage() {
    localStorage.setObject('projects', LoL);
    console.log(localStorage.getObject('projects'));
}
export {
    clearLocalStorage,
    populateStorage,
    loadStorage,
    testingStorage
}