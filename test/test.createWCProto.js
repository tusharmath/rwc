/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import rwc from '../src'
import test from 'ava'
import {spy, stub} from 'sinon'

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
    props: ['A', 'B'],
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
test.afterEach(() => delete global.Event)
test('is function ', t => t.is(typeof rwc.createWCProto, 'function'))
test('patcher', t => {
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent())
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.is(mockPatcher.root, '@ROOT')
  t.deepEqual(mockPatcher.views, ['<div>0</div>'])
})
test.cb('dispatch', t => {
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const component = createMockComponent({
    view ({count}, dispatch) {
      if (count < 4) setTimeout(() => dispatch('INCREMENT')(null))
      return `<div>${count}</div>`
    }
  })
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
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
test('Event', t => {
  const events = []
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const event = new rwc.Event()
  const update = (state) => [state, event]
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.dispatchEvent = ev => events.push(ev)
  wc.createdCallback()
  t.deepEqual([event], events)
})
test('invalid Event', t => {
  global.Event = function () {}
  const events = []
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const update = (state) => [state, null]
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.dispatchEvent = ev => events.push(ev)
  wc.createdCallback()
  t.deepEqual(events, [])
})
test('init()', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const init = spy(x => ({count: 0}))
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({init}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.true(init.calledWith(wc))
})
test('memoize handler', t => {
  let dispatch = null
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const view = ({count}, _dispatch) => {
    dispatch = _dispatch
    return `<div>${count}</div>`
  }
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({view}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.is(dispatch('XYZ'), dispatch('XYZ'))
})
test('attachShadow()', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = spy(() => '@ROOT')
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent())
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.deepEqual(attachShadow.args, [[{mode: 'open'}]])
})
test('attachedCallback()', t => {
  let actions = []
  const mockPatcher = createMockPatcher()
  const attachShadow = spy(() => '@ROOT')
  const update = (s, a) => actions.push(a)
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.attachedCallback()

  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: '@@rwc/attached', params: wc}
  ])
})
test('setProps', t => {
  let actions = []
  const mockPatcher = createMockPatcher()
  const attachShadow = spy(() => '@ROOT')
  const update = (s, a) => actions.push(a)
  const wc = rwc.createWCProto(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.attachedCallback()
  wc['A'] = 100
  wc['B'] = {a: 1, b: 2}
  wc['C'] = new Date()
  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: '@@rwc/attached', params: wc},
    {type: '@@rwc/prop/A', params: 100},
    {type: '@@rwc/prop/B', params: {a: 1, b: 2}}
  ])
})
test('__dispatchActions({preventDefault: true})', t => {
  const mockPatcher = createMockPatcher()
  const mockEV = {preventDefault: spy()}
  const attachShadow = () => '@ROOT'
  const component = createMockComponent()
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.__dispatchActions('MOVE', {preventDefault: true})(mockEV)
  t.true(mockEV.preventDefault.called)
})
test('__dispatchActions({stopPropagation: true})', t => {
  const mockPatcher = createMockPatcher()
  const mockEV = {stopPropagation: spy()}
  const attachShadow = () => '@ROOT'
  const component = createMockComponent()
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.__dispatchActions('MOVE', {stopPropagation: true})(mockEV)
  t.true(mockEV.stopPropagation.called)
})
test('detachedCallback()', t => {
  const actions = []
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const update = (state, action) => {
    actions.push(action)
    return state
  }
  const component = createMockComponent({update})
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.detachedCallback()
  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: '@@rwc/detached', params: wc}
  ])
})
test('__reducer', t => {
  const actions = []
  const mockPatcher = createMockPatcher()
  const mockEV = new rwc.Event('poodle')
  const update = (state, action) => {
    actions.push(action)
    return [state, mockEV]
  }
  const component = createMockComponent({update})
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = () => '@ROOT'
  wc.dispatchEvent = stub()
  wc.createdCallback()
  wc.__reducer({}, {type: 'A', params: 'a'})
  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: 'A', params: 'a'},
    {type: '@@rwc/event/poodle', params: mockEV}
  ])
  t.true(wc.dispatchEvent.calledWith(mockEV))
})
test('createdCallback():copy-initial-values', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const component = createMockComponent()
  const wc = rwc.createWCProto(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc['A'] = 'aaa-initial-value'
  wc['B'] = 'bbb-initial-value'
  wc['C'] = 'ccc-initial-value'
  wc.createdCallback()
  t.is(wc['A'], 'aaa-initial-value')
  t.is(wc['B'], 'bbb-initial-value')
  t.is(wc['C'], 'ccc-initial-value')
})
