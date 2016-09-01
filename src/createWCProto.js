/**
 * @module raf
 */
/**
 * Created by tushar.mathur on 01/09/16.
 */
'use strict'
/* global CustomEvent */
import createStore from 'redux/src/createStore'

/**
 * Creates the prototype for the web component element.
 * @param {Function} patcher - A function that takes in a [shadowRoot]{@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot}
 * element and returns another function which is called every time with the updated virtual dom tree.
 * @param {Object} params - constructor params
 * @param {Function} params.update - This a redux reducer, which takes in the current state and an action and returns a new one. If the function returns an array with the second element as an instance of [CustomEvent], then it would automatically be dispatched as an event.
 * @param {Function} params.view - Takes in the current state and return a new virtual dom node.
 * @param {Function} params.init - Returns the initial state of the component
 */
export default (patcher, params) => {
  const {update, view, init} = params
  return ({
    __dispatchActions (type) {
      return (params) => this.__store.dispatch({type, params})
    },
    __reducer (state, action) {
      const output = update(state, action)
      const [updatedState, event] = output instanceof Array ? output : [output, null]
      if (event instanceof CustomEvent) this.dispatch(event)
      return updatedState
    },
    __render () {
      this.__patch(view(
        this.__store.getState(),
        this.__dispatchAction.bind(this)
      ))
    },
    attributeChangedCallback (name, old, params) {
      this.__store.dispatch({type: `@@attr/${name}`, params})
    },
    createdCallback () {
      this.__patch = patcher(this.createShadowRoot())
      this.__store = createStore(this.__reducer.bind(this), init())
      this.__render()
      this.__dispose = this.__store.subscribe(() => this.__render())
    },
    detachedCallback () {
      this.__dispose()
    }
  })
}
