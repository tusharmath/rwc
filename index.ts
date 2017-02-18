/**
 * Created by tushar on 22/01/17.
 */
import {Action, hoe} from 'hoe'
export * from 'hoe'

export interface Command {
  run (e: Emitter): void
}
export interface Tuple<T> {
  memory: T
  command: Command
}
export interface CustomElement {
  /**
   * Called when the element is inserted into a document, including into a shadow tree
   */

  connectedCallback(): void

  /**
   * Called when the element is removed from a document
   */

  disconnectedCallback(): void

  /**
   * Called when an attribute is changed, appended, removed, or replaced on the element. Only called for observed attributes.
   */

  attributeChangedCallback(attributeName: string, oldValue: string, newValue: string, namespace: string): void

  /**
   * Called when the element is adopted into a new document
   */
  adoptedCallback(oldDocument: DocumentFragment, newDocument: DocumentFragment): void
}
abstract class RwcElement extends HTMLElement implements CustomElement {
  protected emitter = hoe(this.scan.bind(this), {cache: true})

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
    this.emitter.of('@rwc/attr/' + attributeName).emit({oldValue, newValue, namespace})
  }

  adoptedCallback (oldDocument: DocumentFragment, newDocument: DocumentFragment): void {
    this.emitter.of('@rwc/adopt').emit({oldDocument, newDocument})
  }

  abstract scan (action: Action<any>): void
}
export const create = <M> (scan: (action: Action<any>, memory?: M) => Tuple<M>) =>
  class Component extends RwcElement {
    private memory: M

    scan <A> (action: Action<A>): void {
      const t = scan(action, this.memory)
      this.memory = t.memory
      t.command.run(this.emitter)
    }
  }
