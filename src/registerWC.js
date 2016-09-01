/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import {createStore} from 'redux'

/* global HTMLElement, CustomEvent */

function __reducer (state, action) {
  const output = this.update(state, action)
  const [updatedState, event] = output instanceof Array ? output : [output, null]
  if (event instanceof CustomEvent) this.dispatch(event)
  return updatedState
}

function __dispatcher (type) {
  return (params) => this.__store.dispatch({type, params})
}

function attributeChangedCallback (name, old, params) {
  this.__store.dispatch({type: `@@attr/${name}`, params})
}

function createdCallback () {
  this.__patch = this.__createPatcher(this.createShadowRoot())
  const store = this.__store = createStore(this.__reducer.bind(this), this.init())
  this.__render()
  this.__dispose = store.subscribe(() => this.__render())
}
function detachedCallback () {
  this.__dispose()
}

function __render () {
  this.__patch(this.view(
    this.__store.getState(),
    this.__dispatcher.bind(this)
  ))
}

export default function registerWC (createPatcher, name, proto) {
  const base = {
    __createPatcher: createPatcher,
    __dispatcher,
    __reducer,
    __render,

    /* lifecycle handlers */
    createdCallback,
    detachedCallback,
    attributeChangedCallback
  }
  const prototype = Object.assign(Object.create(HTMLElement.prototype), base, proto)
  document.registerElement(name, {prototype})
}
