/**
 *  Flatten, only one layer deep
 * @param {Array} array 
 */
function flatten (array) {
    return [].concat(...array)
}

function isEventProp (name) {
    return /^on/.test(name)
}

function isCustomProp (name) {
    return isEventProp(name)
}

export function h (type, props, ...children) {
    let _children = flatten(children)  // for something like {map(x => x)}
    return {
        type,
        props: props || {},
        children: _children
    }
}

function setProp ($target, name, value) {
    if (isCustomProp(name)) {
        return
    } else if (name === 'className') {
        $target.setAttribute('class', value)
    } else if (typeof value === 'boolean') {
        setBooleanProp($target, name, value)
    } else {
        $target.setAttribute(name, value)
    }
}

function setBooleanProp($target, name, value) {
    if (value) {
        $target.setAttribute(name, value)
        $target[name] = true
    } else {
        $target[name] = false
    }
}

function removeBooleanProp ($target, name, value) {
    $target.removeAttribute(name)
    $target[name] = false
}

function removeProp ($target, name, val) {
    if (isCustomProp(name)) {
        return
    }
    else if (name === 'className') {
        $target.removeAttribute('class')
    }
    else if (typeof value === 'boolean') {
        removeBooleanProp($target, name, val)
    } else {
        $target.removeAttribute(name) 
    }
}  

function updateProp ($target, name, newVal, oldVal) {
    if (!newVal) {
        removeProp($target, name, oldVal)
    }
    else if (!oldVal || newVal !== oldVal) {
        setProp($target, name, newVal)
    }
}

function setProps ($target, props) {
    Object.keys(props).forEach(name => {
        setProp($target, name, props[name])
    })
}

function updateProps ($target, newProps, oldProps = {}) {
    let props = Object.assign({}, newProps, oldProps) 
    Object.keys(props).forEach(name => {
        updateProp($target, newProps[name], oldProps[name])
    })
}

function extractEventName (name) {
    return name.slice(2).toLowerCase()
}

function addEventListener ($target, name, value) {
    if (isEventProp(name)) {
        $target.addEventListener(extractEventName(name), value)
    }
}

function addEventListeners ($target, props) {
    Object.keys(props).forEach(name => {
        addEventListener($target, name, props[name])
    })
}

export function createElement (vnode) {
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode)
    }
    let $el = document.createElement(vnode.type)

    setProps($el, vnode.props)
    addEventListeners($el, vnode.props)

    vnode.children
        .map(createElement) 
        .forEach($el.appendChild.bind($el))

    return $el
}

function changed (node1, node2) {
    return typeof node1 !== typeof node2 || 
        typeof node1 === 'string' && node1 !== node2 ||
        node1.type !== node2.type
}

export function updateElement ($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        $parent.appendChild(
            createElement(newNode)        
        )
    }
    else if (!newNode) {
        $parent.removeChild(
            $parent.childNodes[index]
        )
    }
    else if (changed(newNode, oldNode)) {
        $parent.replaceChild(
            createElement(newNode),
            $parent.childNodes[index]
        )
    } else if (newNode.type) {
        let newLength = newNode.children.length
        let oldLength = oldNode.children.length

        for (let i = 0; i < newLength || i < oldLength; i++) {
            updateElement(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i], 
                i
            )
        }
    }
}