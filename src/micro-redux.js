/**
 * Created by tushar.mathur on 05/09/16.
 */

'use strict'

const INIT = {type: '@@redux/INIT'}

export class Store {
  constructor (reducer, state) {
    this.__reducer = reducer
    this.__state = state
    this.__listners = []
    this.__dispatching = false
    this.dispatch(INIT)
  }

  subscribe (listener) {
    const i = this.__listners.push(listener)
    return () => this.__listners.splice(i - 1, 1)
  }

  getState () {
    return this.__state
  }

  dispatch (action) {
    if (this.__dispatching) return
    this.__dispatching = true
    this.__state = this.__reducer(this.__state, action)
    for (let i = 0; i < this.__listners.length; i++) {
      this.__listners[i](this.__state)
    }
    this.__dispatching = false
  }
}

export const createStore = (reducer, state) => new Store(reducer, state)
