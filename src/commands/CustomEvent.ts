/**
 * Created by tushar on 22/01/17.
 */

class CustomEventCommand<T> implements Command {
  constructor (private type: string, private detail: T) {
  }

  run (e: Emitter, ce: HTMLElement): void {
    ce.dispatchEvent(new CustomEvent(this.type, this.detail))
  }
}

export const event = <T> (type: string, detail: T) => new CustomEventCommand(type, detail)
