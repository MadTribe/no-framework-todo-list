(function(doc,win){
    /**
     * utility method to find an element
     * @param {css query} query 
     */
    function find(query){
        return doc.querySelector(query);
    };

    /**
     * Utility function for builing a dom structure
     * Returns a function that takes child elements as parameters allowing for 
     * code structures like this:
     * 
     *  e("div")(
     *      e("p", "Some of my favorite things:"),
     *      e("ul")(
     *          e("li","whiskers on kittens"),
     *          e("li","raindrops on roses"),
     *          e("li","bright copper kettles")    
     *      )       
     *  )
     * 
     * @param {String} tagName 
     * @param {String} text 
     * @param {Map} attrs 
     * @param {String} id 
     */
    function e(tagName, text, attrs, id){
        if (arguments.length < 2){
            text = null;
        }
        if (arguments.length < 3){
            attrs = {};
        }  
        if (arguments.length < 4){
            id = null;
        }  
        return function(){
            var children = arguments;
            if (arguments.length > 0){
                if (Array.isArray (arguments[0])){
                    children = arguments[0]
                }
            }
           
            var elem = null;
            if (id == null){
                id = ''
            }
            attrs.id = id;

            elem = doc.getElementById(id);

            var focused = false;
            if (document.activeElement == elem){    
                focused=true;
            }

            if (elem == null){
                elem = doc.createElement(tagName);
            } else {
                console.log('reusing ',id);
            }


            for (const attrName in attrs) {
                elem.setAttribute(attrName,attrs[attrName])
            }

            if (typeof children != 'undefined'){
                for(let i = 0; i < children.length; i++){ 
                    var child = children[i]
                    if (typeof child === 'function'){
                        elem.appendChild(child())
                    } else {
                        elem.appendChild(child)
                    }
                };
            }

            if (focused){
                setTimeout(function(){
                    elem.focus();
                },0)
               
            }
            if (text != null && text !== ""){
                elem.innerText = text;
            }
            return elem;
        }
    };

    /**
     * 
     * @param {object} item model to render
     * @param {elem} event bus
     */
    function todo_item(item, bus){
    
        var setState = function(item, state){
            var cls = "done";
            if (state){
                cls = "done";
            } else {
                cls = "not-done";
            }  
            item.classList.add(cls)
            item.classList.add('todo')
        }

        var draw = function(){
                var check=e('span','')()
                check.className="check";  

                var taskText = null;
                var clickable = null;
                var ret = null;
                if (item.edit == false){
                    taskText = e('label',item['name']);
         
                    clickable = e('div')(
                        check,
                        taskText       
                    )

                    ret = clickable;
                    
                } else {
                    taskText = e('input',item['name'], {"type":"text", "value": item.name})();
                    clickable = check;
                    ret = e('div')(
                        check,
                        taskText       
                    );
                }
     
                
                var delBtn = e('div')();
                delBtn.classList.add('delete-btn')
                delBtn.classList.add('btn')
                var actionBtn = null; 
                if (item.edit == false){
                    actionBtn = e('div')();
                    actionBtn.classList.add('edit-btn')
                    actionBtn.onclick = function(){
                        item.edit = true;
                        bus.dispatchEvent(new Event('redraw'));
                    }
                } else {
                    actionBtn = e('div')();
                    actionBtn.classList.add('save-btn')
                    actionBtn.onclick = function(){
                        item.edit = false;
                        console.log('task component',taskText)
                        item.name = taskText.value
                        bus.dispatchEvent(new Event('redraw'));
                    }
                }
                actionBtn.classList.add('btn')
                
                delBtn.onclick = function(){
                    bus.dispatchEvent(new CustomEvent('delete', {'detail':item}));
                }

                var elem = e('div')(
                        ret,
                        actionBtn,
                        delBtn
                    )
                
                clickable.onclick = function(){
                    item['done'] = !item['done'];
                    setState(elem,item['done']);

                    bus.dispatchEvent(new Event('redraw'));
                }
                
                setState(elem,item['done']);
                return elem;
        }

        return draw;
    }

    /**
     * 
     * @param {Array} model 
     */
    function todo_list(model,filter, bus){
        var elems = model.filter(function(task){
            if (filter == ''){
                return true;
            } else if (task.name.indexOf(filter) > -1){
                return true;
            }
            return false;
        }).map(function(e) {
            return todo_item(e, bus);
        });
        return e('ol')(
            elems
        )
    }

    /**
     * Create the task input and add button
     * @param {event bus} bus 
     * @param {data model} model 
     */
    function addTaskBtn(bus, model,focused){
        var input = e('input',null,{'type':'textbox',
                                      'placeholder':'Make a nice cup of tea.'},'task-input')();
        var btn = e('button',"Add Task")();

        btn.onclick=function(){
            console.log('new task ', input.value);
            if (input.value != ""){
                model.push({"name": input.value,"done":false, "edit":false})

                bus.dispatchEvent(new Event('redraw'));
            }
        }
        return e('span')(
            input,
            btn
        ) 
    }

    function filterInput(bus, filter, focused){
        console.log('filter input', filter,focused);
        const input = e('input',null,{'type':'textbox',
                                      'placeholder':'search'},'filter-input')();
        input.value =filter
       
        input.onkeyup = function(e){
            bus.dispatchEvent(new CustomEvent('filter', {'detail':input.value}));
        }
        return input;
    }

    // locate the position for the app on the page.
    var app = find('#app');

    // Load data from localStorage or display default data if none found
    var model =  JSON.parse(localStorage.getItem("todo_data")) || {
        "filter": "",
        'focus':"addTaskBtn",
        "todos":[{"name":"washing up","done":true,"edit":false},
        {"name":"sweep floor","done":false,"edit":false},
        {"name":"homework","done":true,"edit":false},
        {"name":"party","done":false,"edit":false}]
    }

    var container = null;

    /**
     * Draw the application under the container element
     * @param {elem} app 
     */
    function redraw(app, model){
        var oldContainer = container;


        // build the whole app structure.
        container = e('div')(
            e('h2','No Framework Todo List'),
            
            e('p','Tasks are saved as in your localStorage.'),
            addTaskBtn(app, model.todos, model.focus === "addTaskBtn"),
            filterInput(app, model.filter, model.focus === "filterInput"),
            e('span','filter.'),
            todo_list(model.todos,model.filter ,app)   
        )
        
        app.appendChild(container)
        // save model on next event loop
        setTimeout(function(){
            localStorage.setItem("todo_data", JSON.stringify(model))
        },0)
        if (oldContainer != null){
            app.removeChild(oldContainer)
        }
    }

    // Trigger initial drawing of the app
    redraw(app, model);

    // Listen for redraw events
    app.addEventListener('filter', function (e) {
        console.log('redraw');
        model.filter = e.detail;
        redraw(app, model);
    }, false);

    // Listen for redraw events
    app.addEventListener('redraw', function (e) {
        console.log('redraw');
        redraw(app, model);
    }, false);

    // Listen for delete task events
    app.addEventListener('delete', function (e) {
        console.log('delete event', e.detail);
        model.todos = model.todos.filter(task => task != e.detail);
        redraw(app, model);
    }, false);

})(document, window)
