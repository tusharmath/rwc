/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import rwc from '../src'
import test from 'ava'

function mockComponent () {
  return {
    init () {
      return {count: 0}
    },
    update  (state, {type}) {
      switch (type) {
        case 'INCREMENT':
          return {counter: state.count + 1}
        case 'DECREMENT':
          return {counter: state.count - 1}
        default:
          return state
      }
    },
    view ({count}) {
      return `<div>${count}</div>`
    }
  }
}

test('is function ', t => t.is(typeof rwc.createWCProto, 'function'))
test(() => {
  const mockPatcher = root => view => null

  function createShadowRoot () { return '@ROOT' }

  const wc = rwc.createWCProto(mockPatcher, mockComponent())
  wc.createShadowRoot = createShadowRoot
  wc.createdCallback()
})
