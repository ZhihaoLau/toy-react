export function h (type, props, ...children) {
    return {
        type,
        props,
        children
    }
}

export function createElement (vnode) {
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode)
    }
    let $el = document.createElement(vnode.type)
    vnode.children
        .map(createElement) 
        .forEach($el.appendChild.bind($el))

    return $el
}