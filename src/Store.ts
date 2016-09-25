/**
 * Created by tushar.mathur on 05/09/16.
 */

"use strict"
import IState from "./lib/IState";
import IAction from "./lib/IAction";
import IReducer from "./lib/IReducer";


class Store {
  private __reducer: IReducer
  private __state: IState
  private __listeners: Array<Function>
  private __dispatching: boolean

  constructor (reducer: IReducer, state: IState) {
    this.__reducer = reducer
    this.__state = state
    this.__listeners = []
    this.__dispatching = false
  }

  subscribe (listener: Function) {
    const i = this.__listeners.push(listener)
    return () => this.__listeners.splice(i - 1, 1)
  }

  getState (): IState {
    return this.__state
  }

  dispatch (action: IAction) {
    if (this.__dispatching) return
    this.__dispatching = true
    this.__state = this.__reducer(this.__state, action)
    for (let i = 0; i < this.__listeners.length; i++) {
      this.__listeners[i](this.__state)
    }
    this.__dispatching = false
  }

  static of (reducer: IReducer, state: IState) {
    return new Store(reducer, state)
  }
}

export default Store
