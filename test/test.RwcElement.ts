/**
 * Created by tushar on 22/01/17.
 */
import * as assert from 'assert'
import {RwcElement, noop} from '../index'
import {Action} from 'hoe'


export class TestElement extends RwcElement<any> {
  public actions: Array<Action<any>> = []

  init (): number {
    return 0
  }

  update (a: Action<any>, s: number): number {
    switch (a.type) {
      case 'inc':
        return s + 1
      case 'dec':
        return s - 1
      default:
        return s
    }
  }

  view (e: Emitter, s: number) {
    return 'AAA'
  }

  command (a: Action<any>, s: number): Command {
    return noop()
  }

  onAction (action: Action<any>) {
    this.actions.push(action)
  }
}


it('constructor()', () => {
  new TestElement()
})


it('internal events', () => {
  const e = new TestElement()
  e.connectedCallback()
  e.attributeChangedCallback('href', 'AA', 'BB', 'XX')
  e.adoptedCallback('DOC0' as any, 'DOC1' as any)
  e.disconnectedCallback()
  assert.deepEqual(e.actions, [
    Action.of('@rwc/connect', e),
    Action.of('@rwc/attr/href', {oldValue: 'AA', newValue: 'BB'}),
    Action.of('@rwc/adopt', {oldDocument: 'DOC0', newDocument: 'DOC1'}),
    Action.of('@rwc/disconnect', e)
  ])
})


it('set data()', () => {
  const e = new TestElement()
  e.data = {x: 1000}
  e.data = {x: 2000}
  assert.deepEqual(e.actions, [
    Action.of('@rwc/data', {x: 1000}),
    Action.of('@rwc/data', {x: 2000})
  ])
})
