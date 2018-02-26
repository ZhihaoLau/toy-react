import React from '../../src/index'

// For more about JSX transformer: https://babeljs.io/docs/plugins/transform-react-jsx/
function addTodo () {
    console.log('addTodo triggered')

    let $input = document.querySelector('input')

    setState({
        todos: [...state.todos, {
            text: $input.value,
            completed: false
        }] 
    })

    $input.value = ''
}

let state = {
    todos: [
        {
            text: 'todo1',
            completed: false
        },
        {
            text: 'todo2',
            completed: true 
        }
    ]
}

function render (state) {
    /** @jsx React.h */
    return (
        <div>
            <input type="text" ref="input" placeholder="Write something..."/>
            <button onClick={ev => addTodo()}>Add</button>
            <ul className="list">
                {state.todos.map(todo =>
                    <li className="item" completed={todo.completed}>{todo.text}</li>
                )} 
            </ul>
        </div>
    )
}

let app = render(state) 

function setState (patch) {
    Object.assign(state, patch)

    let newApp = render(state) 
    React.updateElement($app, newApp, app)
    app = newApp
}

let vnode = React.createElement(app)

let $app = document.querySelector('#app')
$app.appendChild(vnode)