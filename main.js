(function () {
  let arr;
  let id;
  if (localStorage.getItem('key') !== null) {
    arr = JSON.parse(localStorage.getItem('key'));
    id = arr.length;
  } else {
    arr = [];
    id = 0;
  }

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = ('Введите название нового дела');
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function doneLocalItems(todo) {
    arr[todo.id].done = arr[todo.id].done ? false : true;
    localStorage.setItem('key', JSON.stringify(arr));
  }

  function removeLocalItems(todo) {
    let todoIndex = todo.children[0].innerText;
    arr.splice(arr.indexOf(todoIndex), 1);
    localStorage.setItem('key', JSON.stringify(arr));
  }

  function createTodoItem(name, index) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.id = index;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success');
      doneLocalItems(item);
    });

    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        item.remove();
        removeLocalItems(item);
      }
    });
    return {
      item,
      doneButton,
      deleteButton,
    };
  }
  function filterItems() {
    let activeItems = arr.length && arr.filter((el) => el.done == false);
    let completedItems = arr.length && arr.filter((el) => el.done == true);
    arr = [...activeItems, ...completedItems];
  }

  let list = document.createElement('ul');
  function createTodoList() {
    list.classList.add('list-group');
    filterItems();
    if (arr.length > 0) {
      arr.forEach((el, index) => {
        list.append(createTodoItem(el.name, index).item);
      });
    }
    return list;
  }

  function createTodoApp(container, title = 'Список дел', key, array) {
    if (array.length > 0) {
      array.forEach((el) => {
        list.append(createTodoItem(el.name).item);
      });
    }
    array = JSON.parse(localStorage.getItem(key));
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.button.disabled = true;

    todoItemForm.input.addEventListener('input', () => {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });

    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      todoItemForm.button.disabled = true;
      if (!todoItemForm.input.value) {
        return;
      }
      let todoItem = createTodoItem(todoItemForm.input.value);

      let itemTest = {
        name: todoItemForm.input.value,
        done: false,
        id,
      };
      arr.push(itemTest);
      id++;
      localStorage.setItem('key', JSON.stringify(arr));

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
    });
  }
  window.createTodoApp = createTodoApp;
}());
