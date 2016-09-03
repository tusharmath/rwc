# rwc (BETA)
[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/rwc)
[![npm](https://img.shields.io/npm/v/rwc.svg)](https://www.npmjs.com/package/rwc)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/rwc/badge.svg)](https://coveralls.io/github/tusharmath/rwc)

RWC is a unique mix of [Shadow DOM] + [Virtual DOM] + [Redux] to create [web-components].
This approach is an attempt to find a balance between a [scalable paradigm] and performance.

[scalable paradigm]: http://staltz.com/why-react-redux-is-an-inferior-paradigm.html
[Shadow DOM]:        http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
[Virtual DOM]:       https://github.com/paldepind/snabbdom
[Redux]:             http://redux.js.org
[web-components]:    http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
[reducer]:           http://redux.js.org/docs/basics/Reducers.html
[ELM architecture]:  http://guide.elm-lang.org/architecture/
[CustomEvent]:       https://developer.mozilla.org/en/docs/Web/API/CustomEvent
[snabbdom]:          https://github.com/paldepind/snabbdom
[ShadowRoot]:        https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot
[actions]:           http://redux.js.org/docs/basics/Actions.html
[preact]:            https://github.com/developit/preact
## Installation

```bash
npm install rwc --save
```

## Paradigm
Components are composed of three functions —
  - `init(component)` : The function takes in the current instance of the component and returns the initial state.
  - `update(state, action)`: A [reducer] function like that in [Redux] that takes an input `state` and based on the `action` returns a new output state. Additionally it can return a tuple (an array) of two elements containing both the `state` and an object of [CustomEvent] type, which is dispatched as a DOM event.
  - `view(state, dispatch)`: The view function converts the `state` into a virtual DOM tree. Additionally it also gets a `dispatch()` function which can dispatch [actions] on DOM events.

All these three functions are essentially pure functions, ie. they have no side effects and should remain referentially transparent for all practical purposes.

## Create Component

```js
// CounterComponent.js

import h from 'snabbdom/h'

// Creates an initial state
const init = () => {
  return {count: 0}
}

// Reducer function for redux
const update = (state, {type, params}) => {
  switch (type) {
    case 'INC': return {count: state.count + 1}
    case 'DEC': return {count: state.count - 1}
    default: return state
  }
}

// Creates virtual DOM elements
const view = ({count}, dispatch) => {
  return h('div', [
    h('h1', [count]),
    h('button', {on: {click: dispatch('INC')}}, ['Increment']),
    h('button', {on: {click: dispatch('DEC')}}, ['Decrement'])
  ])
}

export default {init, view, update}
```

## Register Web Component

```js
import rwc from 'rwc'
import CounterComponent from './CounterComponent'

function virtualDOMPatcher (shadowRoot) {
  return (vnode) => /* patches the shadowRoot with vNode */
}

// create prototype object
const proto = rwc.createWCProto(virtualDOMPatcher, CounterComponent)

// create an HTMLElement instance
const html = Object.create(HTMLElement.prototype)

// extend html element with the created prototype
const CounterHTMLComponent = Object.assign(html, proto)

// register as usual
document.registerElement('x-counter', {prototype: CounterHTMLComponent})
```

## Virtual DOM Patcher
The `virtualDOMPatcher` function argument gives the to ability to customize how the shadow DOM is updated.

#### Examples:
1. [view snabbdom demo](https://esnextb.in/?gist=ba33f1903a3eefec86642afd34baf2b4)

  ```js
  import snabbdom from 'snabbdom'

  function virtualDOMPatcher (shadowRoot) {
    const patch = snabbdom.init()
    let __vNode = shadowRoot.appendChild(document.createElement('div'))
    return function (vNode) {
      __vNode = patch(__vNode, vNode)
    }
  }
  ```

2. [view preact demo](https://esnextb.in/?gist=a5d9ddb7805a741c042516d170c0a150)

  ```js
  import { render } from 'preact'
  import { createElement as h } from 'preact-hyperscript'

  function virtualDOMPatcher (shadowRoot) {
    let __vNode
    return function (vNode) {
      __vNode =render(vNode, shadowRoot, __vNode)
    }
  }
  ```

3. [view maquette demo](https://esnextb.in/?gist=3d01659f63f914882340e4173d5d273d)

  ```js
  import {h, createProjector} from 'maquette'

  function virtualDOMPatcher (root) {
    let __vNode
    const projector = createProjector()
    const render = () => projector.append(root, () => __vNode)
    return function (vNode) {
      if(!__vNode) {
        __vNode = vNode
        render()
      }
      __vNode = vNode
    }
  }
  ```

## Dispatching Custom Events
For components to communicate with the outside world the component can dispatch a [CustomEvent] via the `update()` function.

```js
export const update = (state, {type, params}) => {
  switch (type) {

    case 'INC':
      {count: state.count + 1},
      return [
        {count: state.count + 1},
        new CustomEvent('changed', {detail: _state.count})
      ]

    case 'DEC':
      const _state = {count: state.count - 1}
      return [
        _state,
        new CustomEvent('changed', {detail: _state.count})
      ]

    default: return state

  }
}
```

## Listening to attribute changes
Attribute changes are fired as [actions] and are namspaced with `@@attr`. For example —
```html
<x-counter some-custom-attribute="100" />
```
The changes can be observed inside the update function using `@@attr/some-custom-attribute` —
```js
update (state, {type, params}) {
  switch (type) {
    case '@@attr/some-custom-attribute':
      return {count: state.count + parseInt(params)}
    default: return state
  }
}
```

## Listening to the attached event
A special action `@@attached` is fired when the component is attached into the DOM. 
The `param` for this action is the instance of the web component.

```js
update (state, {type, params}) {
  switch (type) {
    case '@@attached':
      return {width: params.getBoundingClientRect().width}
    default: return state
  }
}
```


{{>main}}
