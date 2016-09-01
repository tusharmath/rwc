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


{{>main}}
