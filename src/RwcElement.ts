/**
 * Created by tushar on 22/01/17.
 */
import {hoe, Action} from 'hoe'
import {render, VNode} from 'preact'

export abstract class RwcElement<T> extends HTMLElement implements CustomElement {
  private emitter = hoe(this.onAction.bind(this), {cache: true})
  private shadowEL = this.attachShadow({mode: 'open'})
  private state = this.init()
  private patchEL: Element

  connectedCallback (): void {
    this.emitter.of('@rwc/connect').emit(this)
  }

  disconnectedCallback (): void {
    this.emitter.of('@rwc/disconnect').emit(this)
  }

  attributeChangedCallback (attributeName: string, oldValue: string, newValue: string, namespace: string): void {
    this.emitter.of('@rwc/attr').emit({oldValue, newValue, name: attributeName})
  }

  adoptedCallback (oldDocument: DocumentFragment, newDocument: DocumentFragment): void {
    this.emitter.of('@rwc/adopt').emit({oldDocument, newDocument})
  }

  protected onAction (action: Action<any>) {

    // get new state
    const state = this.update(action, this.state)

    // get command
    const command = this.command(action, this.state)

    // get the view
    const view = this.view(this.emitter, this.state)

    // update state
    this.state = state

    // patch the dom
    this.patchEL = render(view, this.shadowEL as any, this.patchEL)

    // run commands
    command.run(this.emitter, this)
  }

  abstract init (): T

  abstract update (a: Action<any>, s: T): T

  abstract view (e: Emitter, s: T): VNode

  abstract command (a: Action<any>, s: T): Command
}