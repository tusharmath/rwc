# rwc (BETA)
[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/rwc)
[![npm](https://img.shields.io/npm/v/rwc.svg)](https://www.npmjs.com/package/rwc)

RWC is tiny framework for creating [web-components] that is heavily inspired by ELM.
The approach is an attempt to find a balance between a [scalable paradigm] and performance.

[ELM]:               http://elm-lang.org
[scalable paradigm]: http://staltz.com/why-react-redux-is-an-inferior-paradigm.html
[Shadow DOM]:        http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
[Virtual DOM]:       https://github.com/paldepind/snabbdom
[web-components]:    http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
[reducer]:           http://redux.js.org/docs/basics/Reducers.html
[ELM architecture]:  http://guide.elm-lang.org/architecture/
[CustomEvent]:       https://developer.mozilla.org/en/docs/Web/API/CustomEvent
[Event]:             https://developer.mozilla.org/en-US/docs/Web/API/Event
[snabbdom]:          https://github.com/paldepind/snabbdom
[ShadowRoot]:        https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot
[actions]:           http://redux.js.org/docs/basics/Actions.html
[preact]:            https://github.com/developit/preact
## Installation

```bash
npm install rwc --save
```

[shadow dom v1]: http://hayato.io/2016/shadowdomv1/

## Paradigm

A component is made up of *Four* pure functions.
  - `init()` : Provides the initial state `S` of the component.
  - `update(a: Action, s: State)`: A [reducer] function like that in [Redux] that takes an input `state` and based on the `action` returns a new output state.
  - `view(e: Emitter, s: State)`: The view function converts the `state` into a virtual DOM tree. Additionally it also gets an instance of the `Emitter` that can be used to handle events.
  - `command(a: Action, s: State)`: The `command()` function is like the `update()` function except that it return an object of type `Command`.
