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
     * Add a new todo item to the list or update an existing one
     * @param {string} text - The text of the todo item 
     */
    function saveTodo(text, id) {
        if (typeof id === 'undefined') {
            todoApp.data.tasks.push({
                text: text,
                done: false,
                id: Date.now(),
            });
        } else {
            todoApp.data.tasks.forEach(function (task) {
                if (task.id == id) {
                    task.text = text;
                }
            });
        }
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
        initEditButton(todoApp.editBtns);
        return todos;
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item', 'list-group-item');
        li.setAttribute('data-id', todo.id);
        li.innerHTML = `
        <label class="d-flex flex-wrap align-items-center justify-content-between">
            <div class="col-sm-auto col-12">
            <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''}>
            <span class="todo-text ${todo.done ? 'done' : ''}">${todo.text}</span>
            <span class="todo-edit"><i class="fas fa-edit fa-xl"></i></span>
            <span class="todo-remove"><i class="fas fa-times fa-xl"></i></span>
            </div>
            <div class="col-sm-auto col-12">
            <span class="created-at">${new Date(todo.id)
                .toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: true,
                })}</span>
            </div>
        </label>
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

    function initCheckbox() {
        checkboxes = document.querySelectorAll('.todo-checkbox');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function (e) {
                const id = e.target.closest('.todo-item').getAttribute('data-id');
                todo = todoApp.data.tasks.find((todo) => {
                    return todo.id == id;
                });
                todo.done = checkbox.checked;
                updateLocalStorage();
                renderList();
            });
        });
    }

    function initRemoveButton() {
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

    function initEditButton() {
        editBtns = document.querySelectorAll('.todo-edit');
        editBtns.forEach(function (editBtn) {
            editBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const todo = e.target.closest('.todo-item');
                const id = todo.getAttribute('data-id');
                const text = todo.querySelector('.todo-text').textContent;

                const editForm = document.createElement('form');
                editForm.classList.add('todo-edit-form');
                editForm.innerHTML = `
                <div class="form-group d-flex">
                    <input type="text" class="form-control rounded-0 rounded-start" class="todo-edit-input" value="${text}">
                    <button type="submit" class="btn btn-primary rounded-0 rounded-end">Save</button>
                </div>
                `;
                editForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const text = editForm.querySelector('#todo-edit-input').value;
                    saveTodo(text, id);
                    editForm.remove();
                });
                todo.parentElement.insertBefore(editForm, todo);
                todo.remove();
            });
        });
    }

    function updateLocalStorage() {
        localStorage.setItem('todoApp', JSON.stringify(todoApp.data));
    }
}
