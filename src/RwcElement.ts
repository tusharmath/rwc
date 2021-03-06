/**
 * Created by tushar on 22/01/17.
 */

import * as hoe from 'hoe'

export abstract class RwcElement<T> extends HTMLElement implements CustomElement {
  protected emitter = hoe.create(this.onAction.bind(this))

  set data (value: any) {
    this.emitter.of('@rwc/data').emit(value)
  }

  connectedCallback (): void {
    this.emitter.of('@rwc/connect').emit(this)
  }

  disconnectedCallback (): void {
    this.emitter.of('@rwc/disconnect').emit(this)
  }

  attributeChangedCallback (attributeName: string, oldValue: string, newValue: string, namespace: string): void {
    this.emitter.of('@rwc/attr/' + attributeName).emit({oldValue, newValue})
  }

  adoptedCallback (oldDocument: DocumentFragment, newDocument: DocumentFragment): void {
    this.emitter.of('@rwc/adopt').emit({oldDocument, newDocument})
  }

  abstract onAction (action: Action<any>): void

  abstract init (): T

  abstract update (a: Action<any>, s: T): T

  abstract view <V> (e: Hoe, s: T): V

  abstract command (a: Action<any>, s: T): Command
}
