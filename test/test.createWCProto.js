/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import test from 'ava'
import {spy} from 'sinon'
import rwc from '../src'
import {NoEffect, toTuple} from '../src/ReactiveHTMLElement'
import {HTMLElement} from '../src/lib/HTMLElement'

/**
 * Test Utils
 */
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
function createWebComponent (patcher, component) {
  return Object.create(rwc.createWCProto(patcher, component))
}

/**
 * Tests
 */
test.afterEach(() => delete global.Event)
test('is an instance of ReactiveHTMLElement', t => {
  t.true(createWebComponent() instanceof HTMLElement)
  t.true(typeof createWebComponent()['createdCallback'] === 'function')
  t.true(typeof createWebComponent()['attributeChangedCallback'] === 'function')
  t.true(typeof createWebComponent()['attachedCallback'] === 'function')
  t.true(typeof createWebComponent()['detachedCallback'] === 'function')
})
test('patcher', t => {
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const wc = createWebComponent(mockPatcher.patcher, createMockComponent())
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
  const wc = createWebComponent(mockPatcher.patcher, component)
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
test('Task.run()', t => {
  const effects = []
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const task = {run: spy(() => effects.push('#crazy-side-effect'))}
  const update = (state) => [state, task]
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.dispatchEvent = ev => effects.push(ev)
  wc.createdCallback()
  t.deepEqual(['#crazy-side-effect'], effects)
  t.true(task.run.calledWith(wc, wc.__dispatchStoreAction))
})
test('invalid Task', t => {
  global.Event = function () {}
  const Tasks = []
  const mockPatcher = createMockPatcher()

  function attachShadow () { return '@ROOT' }

  const update = (state) => [state, null]
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({update}))
  wc.attachShadow = attachShadow
  wc.dispatchEvent = ev => Tasks.push(ev)
  wc.createdCallback()
  t.deepEqual(Tasks, [])
})
test('init()', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const init = spy(x => ({count: 0}))
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({init}))
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
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({view}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.is(dispatch('XYZ'), dispatch('XYZ'))
})
test('attachShadow()', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = spy(() => '@ROOT')
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent())
  wc.attachShadow = attachShadow
  wc.createdCallback()
  t.deepEqual(attachShadow.args, [[{mode: 'open'}]])
})
test('attachedCallback()', t => {
  let actions = []
  const mockPatcher = createMockPatcher()
  const attachShadow = spy(() => '@ROOT')
  const update = (s, a) => actions.push(a)
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({update}))
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
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({update}))
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
  const wc = createWebComponent(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.__domEventHandler('MOVE', {preventDefault: true})(mockEV)
  t.true(mockEV.preventDefault.called)
})
test('__dispatchActions({stopPropagation: true})', t => {
  const mockPatcher = createMockPatcher()
  const mockEV = {stopPropagation: spy()}
  const attachShadow = () => '@ROOT'
  const component = createMockComponent()
  const wc = createWebComponent(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.__domEventHandler('MOVE', {stopPropagation: true})(mockEV)
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
  const wc = createWebComponent(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc.createdCallback()
  wc.detachedCallback()
  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: '@@rwc/detached', params: wc}
  ])
})
test('rwc.__reducer()', t => {
  const actions = []
  const mockPatcher = createMockPatcher()
  const mockTask = {run: spy(() => 'poodle')}
  const update = (state, action) => {
    actions.push(action)
    return [state, mockTask]
  }
  const component = createMockComponent({update})
  const wc = createWebComponent(mockPatcher.patcher, component)
  wc.attachShadow = () => '@ROOT'
  wc.createdCallback()
  wc.__reducer({}, {type: 'A', params: 'a'})
  t.deepEqual(actions, [
    {type: '@@rwc/created', params: wc},
    {type: 'A', params: 'a'}
  ])
  t.true(mockTask.run.called)
})
test('createdCallback():copy-initial-values', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const component = createMockComponent()
  const wc = createWebComponent(mockPatcher.patcher, component)
  wc.attachShadow = attachShadow
  wc['A'] = 'aaa-initial-value'
  wc['B'] = 'bbb-initial-value'
  wc['C'] = 'ccc-initial-value'
  wc.createdCallback()
  t.is(wc['A'])
  t.is(wc['B'])
  t.is(wc.props['A'], 'aaa-initial-value')
  t.is(wc.props['B'], 'bbb-initial-value')
  t.is(wc['C'], 'ccc-initial-value')
})
test('no-props', t => {
  const mockPatcher = createMockPatcher()
  const attachShadow = () => '@ROOT'
  const wc = createWebComponent(mockPatcher.patcher, createMockComponent({props: null}))
  wc.attachShadow = attachShadow
  wc.createdCallback()
})
test('toTuple()', t => {
  const state = {a: 1}
  t.deepEqual(toTuple([state, null]), [{a: 1}, new NoEffect()])
  t.deepEqual(toTuple(state), [{a: 1}, new NoEffect()])
  t.deepEqual(toTuple([state, {}]), [{a: 1}, new NoEffect()])
})
