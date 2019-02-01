

 ;(function () {
    
    let storage = {
        todos: []
    };

    // UI Elements
    const formCol = document.querySelector('.form-col');
    const table = document.querySelector('.table tbody');
    const form = document.forms['addTodoForm'];
    const title = form.elements['title'];
    const text = form.elements['text'];
    //const button = document.querySelector("input[name=buttSave]");
    const button = document.getElementById("editButton");


    // click, keyUp, keyDown, submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!title.value || !text.value) return alertMessage('alert-danger', 'Введите title и text');


        addNewTodoToStorage(title.value, text.value);
        alertMessage('alert-info', 'Задача добавлена успешно');

        form.reset();
    });

    table.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-todo')) {
            const id = e.target.closest('[data-id]').dataset.id;
            deleteTodoFromStorage(id);
            alertMessage('alert-info', 'Задача удалена успешно');
            return;
        }

        if (e.target.classList.contains('edit-todo')) {                
            const id = e.target.closest('[data-id]').dataset.id;      
            setFormtoEdit(id); 
            console.log(id);
        }
    });

    function alertMessage(className, message) {
        removeAlert();

        const template = alertTemplate(className, message);
        formCol.insertAdjacentHTML('afterbegin', template);

        setTimeout(removeAlert, 2000);
    }

    function removeAlert() {
        const currentAlert = document.querySelector('.alert');
        if (currentAlert) formCol.removeChild(currentAlert);
    }

    function alertTemplate(className, message) {
        return `
        <div class="alert ${className}">${message}</div>
        `;
    }

   /**
     * @author Александр
     * @desc 
     * @callback generateId
     * @returns {String} -
     */
    function generateId() {
        const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        let id = '';

        for (let char of words) {
            let index = Math.floor(Math.random() * words.length);
            id += words[index];
        }

        return id;
    }

    /**
     * @author Александр
     * @desc
     * @param {String} title 
     * @param {String} text  - 
     * @returns {Array} 
     */
    function addNewTodoToStorage(title, text) {
        if (!title) return console.log('Введите заголовок задачи');
        if (!text) return console.log('Введите текст задачи');

        const newTask = {
            title,
            text, 
            id: generateId()
        };

        storage.todos.push(newTask);


        addNewTodoToView(newTask);
        
        return storage.todos;
    }

    addNewTodoToStorage('My title 1', 'My text 1');

    /**
     * @author Александр
     * @desc 
     * @param {String} id 
     * @returns {Array} -
     */
    function deleteTodoFromStorage(id) {
        const checkIdRes = checkId(id);
        if (checkIdRes.error) return console.log(checkIdRes.msg);

        let removedTask;

        for (let i = 0; i < storage.todos.length; i++) {
            if (storage.todos[i].id === id) {
                removedTask = storage.todos.splice(i, 1);
                break;
            }
        }

        deleteTodoFromView(id);
        
        return removedTask;
    }

    function checkId(id) {
        if (!id) return { error: true, msg: 'Передайте id задачи' };

        const checkId = storage.todos.some(function(task, i) { 
            return task.id === id 
        });
        if (!checkId) return { error: true, msg: 'id несуществуе' };

        return { error: false, msg: '' };
    }

    /**
     * @author Александр
     * @desc 
     * @param {String} id - 
     * @param {String} title - 
     * @param {String} text  -
     * @returns {Object} - 
     * @example 
     * 
     * editTaskStorage('0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', MyTitle, Mytext)
     * // => {title: "MyTitle", text: "MyText", id: '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'}
     */
    function editTaskStorage(id, title, text) {
        if (!id) return console.log('Передайте id задачи');
        if (!title) return console.log('Передайте title задачи');
        if (!text) return console.log('Передайте text задачи');
        const checkId2 = storage.todos.some(function (task2, i) {
            return task2.id === id;
        });
        if (!checkId2) return console.log('id несуществует');

        let editTask;
        for (let i = 0; i < storage.todos.length; i++) {
            if (storage.todos[i].id === id) {
                storage.todos[i].title = title;
                storage.todos[i].text = text;
                editTask = storage.todos[i];
                break;
            }
        }

        return editTask;
        //editTaskView
    }

    function editTaskView() {
    }

    function setFormtoEdit(id) {
        var link = document.querySelector(`[data-id="${id}"]`);

        function setAttribute(bull) {
            for (let i = 0; i < link.children.length - 1; i++) {
                link.children[i].setAttribute("contenteditable", bull);
            }
        }
        setAttribute("true"); 
        
        

         button.onclick = function() {
             setAttribute("false"); 
             editTaskStorage(id, link.children[0].innerHTML, link.children[1].innerHTML); 
             
         };
       
    }

    function deleteTodoFromView(id) {
        const target = document.querySelector(`[data-id="${id}"]`);
        target.parentElement.removeChild(target);
    }

     /**
     * @author Александр
     * @desc  Функция добавления разметки на страницу,вызывая фцию разметки внутри себя
     * @param {Object} task   -Функция принимает обьект 1 задачи (todolist)
     * @returns {} - возвращает поля разметки в которых генерируется title text 
     */
    function addNewTodoToView(task) {
        const template = todoTemplate(task);
        table.insertAdjacentHTML('afterbegin', template);
    }

    /**
     * @author Александр
     * @desc  Функция для создания разметки
     * @param {Object} task   -Функция принимает обьект 1 задачи
     * @returns {} - возвращает поля разметки в которых генерируется title text 
     */
    function todoTemplate(task) {
        return `
            <tr data-id="${task.id}"> 
                <td>${task.title}</td>
                <td>${task.text}</td>
                <td>
                    <i class="fas fa-trash remove-todo">Delete</i>
                    <i class="fas fa-edit edit-todo">Edit</i>
                </td>
            </tr>
        `;
    }

 })();