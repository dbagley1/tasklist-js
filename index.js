const todoApp = {};
document.addEventListener('DOMContentLoaded', init);
function init() {
    /* Parse existing data from localStorage */
    todoApp.data = JSON.parse(localStorage.getItem('todoApp'));
    if (todoApp.data === null) {
        todoApp.data = {};
        todoApp.data.tasks = [];
    }

    /* Get the DOM elements */
    todoApp.form = document.querySelector('#todo-form');
    todoApp.list = document.querySelector('#todo-list');
    todoApp.input = document.querySelector('#todo-input');

    /* Render the list */
    renderList();
    initForm();

    /**
     * Add a new todo item to the list
     * @param {string} text - The text of the todo item 
     */
    function saveTodo(text) {
        todoApp.data.tasks.push({
            text: text,
            done: false,
            id: Date.now(),
        });
        updateLocalStorage();
        renderList();
    }

    /**
     * Render the todo list
     * @param {array} todos - The array of todo items
     * @param {list} list - The list element to render to
     */
    function renderList(todos = todoApp.data.tasks, list = todoApp.list) {
        list.querySelectorAll('.todo-item')
            .forEach((todo) => { list.removeChild(todo); });
        console.log(todos);
        todos.forEach(function (todo) {
            list.prepend(createTodoElement(todo));
        });
        initCheckbox(todoApp.checkboxes);
        initRemoveButton(todoApp.removeBtns);
        return todos;
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.setAttribute('data-id', todo.id);
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
            <span class="todo-text ${todo.done ? 'done' : ''}">${todo.text}</span>
            <button class="todo-remove"><i class="fa-solid fa-trash-can"></i></a>
        `;
        return li;
    }

    function initForm(form = todoApp.form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const text = todoApp.input.value;
            if (text.length > 0) {
                saveTodo(text);
                todoApp.input.value = '';
            }
        });
    }

    function initCheckbox(checkboxes) {
        checkboxes = document.querySelectorAll('.todo-checkbox');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function (e) {
                const id = e.target.parentElement.getAttribute('data-id');
                todo = todoApp.data.tasks.find((todo) => {
                    return todo.id == id;
                });
                todo.done = checkbox.checked;
                updateLocalStorage();
                renderList();
            });
        });
    }

    function initRemoveButton(removeBtns) {
        removeBtns = document.querySelectorAll('.todo-remove');
        removeBtns.forEach(function (removeBtn) {
            removeBtn.addEventListener('click', function (e) {
                const id = e.target.closest('.todo-item').getAttribute('data-id');
                todoApp.data.tasks = todoApp.data.tasks.filter(function (todo) {
                    return todo.id != id;
                });
                updateLocalStorage();
                renderList();
            });
        });
    }

    function updateLocalStorage() {
        localStorage.setItem('todoApp', JSON.stringify(todoApp.data));
    }
}
