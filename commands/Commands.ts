/**
 * Created by tushar on 22/01/17.
 */
import {Command} from '../index'

class DispatchEvent<T> implements Command {
  constructor (private el: HTMLElement, private type: string, private detail: T) {}

  run (e: Emitter): void {
    this.el.dispatchEvent(new CustomEvent(this.type, this.detail))
  }
}


export const event = <T> (el: HTMLElement, type: string, detail: T): Command => (
  new DispatchEvent(el, type, detail)
)
const Noop = {run () {}} as Command

export const noop = (): Command => Noop
