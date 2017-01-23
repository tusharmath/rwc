/**
 * Created by tushar on 22/01/17.
 */

export const event = <T> (type: string, detail: T): Command => ({
  run (e: Emitter, ce: HTMLElement): void {
    ce.dispatchEvent(new CustomEvent(type, detail))
  }
})
export const noop = (): Command => ({
  run () {
  }
})
