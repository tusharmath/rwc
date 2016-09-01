/**
 * @module raf
 */
/**
 * Created by tushar.mathur on 01/09/16.
 */
'use strict'

import {createStore} from 'redux'
import CustomEvent from './CustomEvent'

function isArray (i) {
  return i instanceof Array
}
/**
 * Creates the prototype for the web component element.
 * @name createWCProto
 * @param {Function} virtualDOMPatcher - patches the virtual dom on [shadowRoot]{@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot}.
 * @param {Object} component
 * @param {Function} component.init - returns the initial state of the component.
 * @param {Function} component.update - a redux reducer for updating component state.
 * @param {Function} component.view - takes in the state and returns a dom tree.
 * @return {Object} prototype object for creating HTMLElements
 */
export default (virtualDOMPatcher, component) => {
  const {update, view, init} = component
  return ({
    __dispatchActions (type) {
      return (params) => this.__store.dispatch({type, params})
    },
    __reducer (state, action) {
      const output = update(state, action)
      const [updatedState, event] = isArray(output) ? output : [output, null]
      if (CustomEvent.is(event)) this.dispatchEvent(event)
      return updatedState
    },
    __render () {
      this.__patch(view(
        this.__store.getState(),
        this.__dispatchActions.bind(this)
      ))
    },
    attributeChangedCallback (name, old, params) {
      this.__store.dispatch({type: `@@attr/${name}`, params})
    },
    createdCallback () {
      this.__patch = virtualDOMPatcher(this.createShadowRoot())
      this.__store = createStore(this.__reducer.bind(this), init())
      this.__render()
      this.__dispose = this.__store.subscribe(() => this.__render())
    },
    detachedCallback () {
      this.__dispose()
    }
  })
}
