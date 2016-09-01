# rwc (BETA)
[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/rwc)
[![npm](https://img.shields.io/npm/v/rwc.svg)](https://www.npmjs.com/package/rwc)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/rwc/badge.svg)](https://coveralls.io/github/tusharmath/rwc)

RWC is a unique mix of [Shadow DOM] + [Virtual DOM] + [Redux] to create [web-components].
This approach is tries to find a balance between a [scalable paradigm] and performance.

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

## Installation

```bash
npm install rwc --save
```

## Features
 - **Pure API:** A component is created using `init`, `update` & `view` all of which a pure functions,
 having no side-effects similar to [ELM architecture].
 - **Custom Events:** Supports dispatching of [CustomEvent] to communicate with the outside world.
 - **Virtual DOM:** Integrates with any virtual DOM implementation.


## Paradigm
Components are composed of three functions —
  - `init()` : Provides the initial state of the component.
  - `update(state, action)`: A [reducer] function of [Redux] that takes an input `state` and based on the `action` returns a new state.
     Additionally the update function can return a tuple (an array) of two elements containing both the `state` and an object of [CustomEvent] type, which is dispatched automatically as an component's event.
  - `view(state, dispatch)`: The view function converts the `state` into a virtual DOM tree.
     Additionally it also gets a `dispatch()` function which can dispatch `actions` on DOM events.

All these three functions are essentially pure functions, ie. they have no side effects and should remain referentially transparent for all practical purposes.

## Create Component

```js
/* CounterComponent.js */

import h from 'snabbdom/h'

export const init = () => {
  return {count: 0}
}

export const update = (state, {type, params}) => {
  switch (type) {
    case 'INC': return {count: state.count + 1}
    case 'DEC': return {count: state.count - 1}
    default: return state
  }
}

export const view = ({count}, dispatch) => {
  return h('div', [
    h('h1', [count]),
    h('button', {on: {click: dispatch('INC')}}, ['Increment']),
    h('button', {on: {click: dispatch('DEC')}}, ['Decrement'])
  ])
}
```

## Register Web Component

```js
import rwc from 'rwc'
import snabbdom from 'snabbdom'
import * as CounterComponent from './CounterComponent'

// Patcher function
function snabbdomPatcher (shadowRoot) {
  const patch = snabbdom.init()
  let __vNode = shadowRoot.appendChild(document.createElement('div'))
  return function (vNode) { __vNode = patch(__vNode, vNode) }
}

// create proto object
const proto = rwc.createWCProto(snabbdomPatcher, CounterComponent)

// create an HTML element
const html = Object.create(HTMLElement.prototype)

// extend the HTML element and register as usual
document.registerElement('x-counter', Object.assign(html, proto))
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

## Virtual DOM Patcher
The `patcher` function gives to ability to customize how the shadow DOM is updated. The function takes in an element of [ShadowRoot] type and returns another function that is called with the Virtual DOM tree node everytime that updates.

<a name="module_raf"></a>

## raf
<a name="module_raf..createWCProto"></a>

### raf~createWCProto ⇒ <code>Object</code>
Creates the prototype for the web component element.

**Kind**: inner property of <code>[raf](#module_raf)</code>  
**Returns**: <code>Object</code> - prototype object for creating HTMLElements  

| Param | Type | Description |
| --- | --- | --- |
| patcher | <code>function</code> | patches the virtual dom on [shadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot). |
| component | <code>Object</code> |  |
| component.init | <code>function</code> | returns the initial state of the component. |
| component.update | <code>function</code> | a redux reducer for updating component state. |
| component.view | <code>function</code> | takes in the state and returns a dom tree. |

