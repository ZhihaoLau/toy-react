import React from '../../src/index'

// For more about JSX transformer: https://babeljs.io/docs/plugins/transform-react-jsx/

/** @jsx React.h */
let list = (
    <ul className="list">
        <li className="item">item1</li>
        <li className="item">item2</li> 
    </ul>
)

let vnode = React.createElement(list)

let $app = document.querySelector('#app')
$app.appendChild(vnode)