/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'
/* global CustomEvent */

import createStore from 'redux/src/createStore'

export default ({update, view, init, patcher}) => ({
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
