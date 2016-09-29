/**
 * Created by tushar.mathur on 25/09/16.
 */


import {IComponent} from './lib/IComponent';
import {IPatch} from './lib/IPatch';
import {Store} from './Store';
import {IState} from './lib/IState';
import {IAction} from './lib/IAction';
import {ITask} from './lib/ITask';
import {IVirtualNode} from './lib/IVirtualNode';
import {IShadowElement} from './lib/IShadowElement';

interface IDispatchOptions {
  preventDefault: Boolean
  stopPropagation: Boolean
}

class NoEffect implements ITask {
  run () {
  }
}

function toTuple (out: IState | [IState, ITask]): [IState, ITask] {
  if (out instanceof Array && out[1] && out[1].run) {
    return out
  }
  return [out, new NoEffect()]
}

function attachShadow (el: any): Node {
  return el.attachShadow({mode: 'open'})
}

export class ReactiveHTMLElement implements IShadowElement {
  private __dispose: Function
  private props: any
  private __store: Store
  private __handlers: any
  private __patch: (vNode: IVirtualNode) => void

  static of (virtualDOMPatcher: IPatch, component: IComponent) {
    return new ReactiveHTMLElement(virtualDOMPatcher, component)
  }


  constructor (private __virtualDOMPatcher: IPatch,
               private __component: IComponent) {
  }

  private __dispatchStoreAction (type: String, params: any) {
    this.__store.dispatch({type, params})
  }

  private __domEventHandler (type: string, options?: IDispatchOptions) {
    if (!this.__handlers[type]) {
      this.__handlers[type] = (params: Event) => {
        if (options) {
          if (options.preventDefault) params.preventDefault()
          if (options.stopPropagation) params.stopPropagation()
        }
        this.__dispatchStoreAction(type, params)
      }
    }
    return this.__handlers[type]
  }

  private __reducer (state: IState, action: IAction) {
    const output = this.__component.update(state, action)
    const [updatedState, task] = toTuple(output)
    task.run(this, this.__dispatchStoreAction)
    return updatedState
  }

  private __render () {
    this.__patch(this.__component.view(
      this.__store.getState(),
      this.__domEventHandler
    ))
  }

  attributeChangedCallback (name: string, old: string, params: string) {
    this.__dispatchStoreAction(`@@rwc/attr/${name}`, params)
  }

  createdCallback () {
    /**
     * bind with this
     */
    this.__dispatchStoreAction = this.__dispatchStoreAction.bind(this)
    this.__domEventHandler = this.__domEventHandler.bind(this)
    this.__reducer = this.__reducer.bind(this)
    this.__render = this.__render.bind(this)

    this.__handlers = {}
    this.props = {}
    if (this.__component.props) {
      this.__component.props.forEach((p: string) => {
        this.props[p] = this[p]
        Object.defineProperty(this, p, {
          get: () => undefined,
          set: (params) => {
            this.props[p] = params
            this.__dispatchStoreAction(`@@rwc/prop/${p}`, params)
          }
        })
      })
    }

    this.__patch = this.__virtualDOMPatcher(attachShadow(this))
    this.__store = Store.of(this.__reducer, this.__component.init(this))
    this.__store.dispatch({type: '@@rwc/created', params: this})
    this.__render()
    this.__dispose = this.__store.subscribe(this.__render)
  }

  attachedCallback () {
    this.__dispatchStoreAction('@@rwc/attached', this)
  }

  detachedCallback () {
    this.__dispatchStoreAction('@@rwc/detached', this)
    this.__dispose()
  }
}
