(function(doc,win){

    function find(query){
        return doc.querySelector(query);
    };

    function e(tagName, text, attrs){
        if (arguments.length < 2){
            text = null;
        }
        if (arguments.length < 3){
            attrs = {};
        }  
        return function(){
            var children = arguments;
            if (arguments.length > 0){
                if (Array.isArray (arguments[0])){
                    children = arguments[0]
                }
            }
            
            var elem = doc.createElement(tagName);

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
            item.className = cls         
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
     
                
                var delBtn = e('button','delete')();
                var actionBtn = null; 
                if (item.edit == false){
                    actionBtn = e('button','edit')();
                    actionBtn.onclick = function(){
                        item.edit = true;
                        bus.dispatchEvent(new Event('redraw'));
                    }
                } else {
                    var actionBtn = e('button','save')();
                    actionBtn.onclick = function(){
                        item.edit = false;
                        console.log('task component',taskText)
                        item.name = taskText.value
                        bus.dispatchEvent(new Event('redraw'));
                    }
                }
                
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
    function todo_list(model, bus){
        var elems = model.map(function(e) {
            return todo_item(e, bus);
        });
        return e('ol')(
            elems
        )
    }

    function addTaskBtn(bus, model){
        var input = e('input',null,{'type':'textbox'})();
        input.focus();
        var btn = e('button',"Add Task")();
        
        btn.onclick=function(){
            console.log('new task ', input.value);
            if (input.value != ""){
                model.push({"name": input.value,"done":false, "edit":false})

                bus.dispatchEvent(new Event('redraw'));
            }
        }
        return e('div')(
            input,
            btn
        ) 
    }

    var app = find('#app');

    var model = [
        {"name":"washing up","done":true,"edit":false},
        {"name":"sweep floor","done":false,"edit":false},
        {"name":"homework","done":true,"edit":false},
        {"name":"party","done":false,"edit":false}
    ]

    var container = null;

    function redraw(app){
        if (container != null){
            app.removeChild(container)
        }

        container = e('div')(
            e('h2','No Framework Todo List'),
            addTaskBtn(app, model),
            todo_list(model, app)   
        )

        app.appendChild(container)
    }

    redraw(app)

    app.addEventListener('redraw', function (e) {
        console.log('redraw');
        redraw(app);
    }, false);


    app.addEventListener('delete', function (e) {
        console.log('delete event', e.detail);
        model = model.filter(task => task != e.detail);
        redraw(app);

    }, false);



})(document, window)