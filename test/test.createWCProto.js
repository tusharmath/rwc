/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import rwc from '../src'
import test from 'ava'
import {spy} from 'sinon'

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
function createMockComponent (params) {
  return Object.assign({
    init () {
      return {count: 0}
    },
    update  (state, {type}) {
      switch (type) {
        case 'INCREMENT':
          return {count: state.count + 1}
        case 'DECREMENT':
          return {count: state.count - 1}
        default:
          return state
      }
    },
    view ({count}) {
      return `<div>${count}</div>`
    }
  }, params)
}
test.afterEach(() => delete global.CustomEvent)
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
test.cb('dispatch', t => {
  const mockPatcher = createMockPatcher()

  function createShadowRoot () { return '@ROOT' }

  const component = createMockComponent({
    view ({count}, dispatch) {
      if (count < 4) setTimeout(() => dispatch('INCREMENT')(null))
      return `<div>${count}</div>`
    }
  })
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.createShadowRoot = createShadowRoot
  wc.createdCallback()
  wc.__store.subscribe(x => {
    if (wc.__store.getState().count === 4) {
      t.deepEqual(mockPatcher.views, [
        '<div>0</div>',
        '<div>1</div>',
        '<div>2</div>',
        '<div>3</div>',
        '<div>4</div>'
      ])
      t.end()
    }
  })
})
test('CustomEvent', t => {
  const events = []
  const mockPatcher = createMockPatcher()

  function createShadowRoot () { return '@ROOT' }

  const event = new rwc.CustomEvent()
  const update = (state) => [state, event]
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.createShadowRoot = createShadowRoot
  wc.dispatchEvent = ev => events.push(ev)
  wc.createdCallback()
  t.deepEqual([event], events)
})
test('invalid CustomEvent', t => {
  global.CustomEvent = function () {}
  const events = []
  const mockPatcher = createMockPatcher()

  function createShadowRoot () { return '@ROOT' }

  const update = (state) => [state, null]
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.createShadowRoot = createShadowRoot
  wc.dispatchEvent = ev => events.push(ev)
  wc.createdCallback()
  t.deepEqual(events, [])
})
test('init()', t => {
  const mockPatcher = createMockPatcher()
  const createShadowRoot = () => '@ROOT'
  const init = spy(x => ({count: 0}))
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({init}))
  wc.createShadowRoot = createShadowRoot
  wc.createdCallback()
  t.true(init.calledWith(wc))
})
