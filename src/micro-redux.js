/**
 * Created by tushar.mathur on 05/09/16.
 */

'use strict'

export class Store {
  constructor (reducer, state) {
    this.__reducer = reducer
    this.__state = state
    this.__listeners = []
    this.__dispatching = false
  }

  subscribe (listener) {
    const i = this.__listeners.push(listener)
    return () => this.__listeners.splice(i - 1, 1)
  }

  getState () {
    return this.__state
  }

  dispatch (action) {
    if (this.__dispatching) return
    this.__dispatching = true
    this.__state = this.__reducer(this.__state, action)
    for (let i = 0; i < this.__listeners.length; i++) {
      this.__listeners[i](this.__state)
    }
    this.__dispatching = false
  }
}

export const createStore = (reducer, state) => new Store(reducer, state)
