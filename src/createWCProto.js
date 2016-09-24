/**
 * @module rwc
 */
/**
 * Created by tushar.mathur on 01/09/16.
 */
'use strict'

import {createStore} from './micro-redux'

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
  const {update, view, init, props = []} = component
  return {
    __dispatchStoreAction (type, params) {
      this.__store.dispatch({type, params})
    },
    __domEventHandler (type, options = {}) {
      if (!this.__handlers[type]) {
        this.__handlers[type] = (params) => {
          if (options.preventDefault) params.preventDefault()
          if (options.stopPropagation) params.stopPropagation()
          this.__dispatchStoreAction(type, params)
        }
      }
      return this.__handlers[type]
    },

    __reducer (state, action) {
      const output = update(state, action)
      const [updatedState, task] = isArray(output) ? output : [output, null]
      if (task) task.run(this, this.__dispatchStoreAction)
      return updatedState
    },

    __render () {
      this.__patch(view(
        this.__store.getState(),
        this.__domEventHandler
      ))
    },

    attributeChangedCallback (name, old, params) {
      this.__dispatchStoreAction(`@@rwc/attr/${name}`, params)
    },

    createdCallback () {
      this.__handlers = {}
      this.props = {}
      this.__domEventHandler = this.__domEventHandler.bind(this)
      this.__render = this.__render.bind(this)

      props.forEach(p => {
        this.props[p] = this[p]
        Object.defineProperty(this, p, {
          get: () => undefined,
          set: (params) => {
            this.props[p] = params
            this.__dispatchStoreAction(`@@rwc/prop/${p}`, params)
          }
        })
      })

      this.__patch = virtualDOMPatcher(this.attachShadow({mode: 'open'}))
      this.__store = createStore(this.__reducer.bind(this), init(this))
      this.__store.dispatch({type: '@@rwc/created', params: this})
      this.__render()
      this.__dispose = this.__store.subscribe(this.__render)
    },

    attachedCallback () {
      this.__dispatchStoreAction('@@rwc/attached', this)
    },
    detachedCallback () {
      this.__dispatchStoreAction('@@rwc/detached', this)
      this.__dispose()
    }
  }
}
