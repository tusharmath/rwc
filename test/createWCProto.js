/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import rwc from '../src'
import test from 'ava'

function createMockPatcher () {
  const output = {
    views: [],
    root: null,
    patcher: function (root) {
      output.root = root
      return function (view) {
        output.views.push(view)
      }
    }
  }
  return output
}
function createMockComponent () {
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
test('patcher', t => {
  const mockPatcher = createMockPatcher()

  function createShadowRoot () { return '@ROOT' }

  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent())
  wc.createShadowRoot = createShadowRoot
  wc.createdCallback()
  t.is(mockPatcher.root, '@ROOT')
  t.deepEqual(mockPatcher.views, ['<div>0</div>'])
})
