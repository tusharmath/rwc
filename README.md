# rwc
[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/rwc)
[![npm](https://img.shields.io/npm/v/rwc.svg)](https://www.npmjs.com/package/rwc)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/rwc/badge.svg)](https://coveralls.io/github/tusharmath/rwc)

RWC is a unique mix of [Shadow DOM] + [Virtual DOM] + [Redux] to create highly performance [web-components].

[Shadow DOM]:     http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
[Virtual DOM]:    https://github.com/paldepind/snabbdom
[Redux]:          redux.js.org
[web-components]: http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/

## Features
 - **Performance:** Each web-component gets it's own unique instance of virtual dom. This makes vDOM diffs a lot more optimized.
 - **Pure API:** A component is composed of `init`, `update` & `view` which a pure functions, having no side-effects just like [ELM].
 - **Custom Events:** Supports dispatching of [CustomEvent] to communicate with the outside world.
 - **Virtual DOM:** Integrates with any virtual dom implementation.
   
[ELM]:         elm-lang.org
[CustomEvent]: https://developer.mozilla.org/en/docs/Web/API/CustomEvent

## Usage

```js
import rwc from 'rwc'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import snabbdomPatcher from './snabbdom-patcher' // check examples to see implemenation

const proto = rwc.createWCProto(snabbdomPatcher, {
  init () {
    return {count: 0}
  },
  update (state, {type, param}) {
    switch (type) {
      case 'INCREMENT': return {count: state.count + 1}
      case 'DECREMENT': return {count: state.count - 1}
      default: return state
    }
  },
  view ({count}, dispatch) {
    return (
      h('div', [
        h('h1', [count]),
        h('button', {on: {click: dispatch('INCREMENT')}}, ['INCREMENT']),
        h('button', {on: {click: dispatch('DECREMENT')}}, ['DECREMENT'])
      ])
    )
  }
})

const html = Object.create(HTMLElement.prototype)
document.registerElement('x-counter', Object.assign(html, proto))
```


## Installation

```bash
npm install rwc --save
```


<a name="module_raf"></a>

## raf
<a name="exp_module_raf--module.exports"></a>

### module.exports(patcher, params) ⏏
Creates the prototype for the web component element.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| patcher | <code>function</code> | A function that takes in a [shadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) element and returns another function which is called every time with the updated virtual dom tree. |
| params | <code>Object</code> | constructor params |
| params.update | <code>function</code> | This a redux reducer, which takes in the current state and an action and returns a new one. If the function returns an array with the second element as an instance of [CustomEvent], then it would automatically be dispatched as an event. |
| params.view | <code>function</code> | Takes in the current state and return a new virtual dom node. |
| params.init | <code>function</code> | Returns the initial state of the component |

