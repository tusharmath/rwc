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

## Installation

```bash
npm install rwc --save
```

## Paradigm
Components are composed of three functions —
  - `init()` : Provides the initial state of the component.
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
import snabbdom from 'snabbdom'
import CounterComponent from './CounterComponent'

// Patcher function (for snabbdom only)
function snabbdomPatcher (shadowRoot) {
  const patch = snabbdom.init()

  // setup shadowroot element
  let __vNode = shadowRoot.appendChild(document.createElement('div'))

  // returned function is called with the latest virtual DOM
  return function (vNode) {
    __vNode = patch(__vNode, vNode)
  }
}

// create prototype object
const proto = rwc.createWCProto(snabbdomPatcher, CounterComponent)

// create an HTMLElement instance
const html = Object.create(HTMLElement.prototype)

// extend html element with the created prototype
const CounterHTMLComponent = Object.assign(html, proto)

// register as usual
document.registerElement('x-counter', CounterHTMLComponent)
```

## Virtual DOM Patcher
The `patcher` function gives the to ability to customize how the shadow DOM is updated. The function takes in an element of [ShadowRoot] type and returns another function that is called whenever a new virtual DOM tree is created.

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
    case default: return state
  }
}
```




{{>main}}