/**
 * Created by tushar on 03/09/17.
 */

import * as assert from 'assert'
import {h, args} from '../src/vdom/hyperscript'

describe('hyperscript', () => {
  describe('h', () => {
    it('should set type', () => {
      const actual = h('div')
      const expected = {
        type: 'div',
        children: [],
        css: [],
        attrs: {},
        props: {},
        style: {},
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set css classes', () => {
      const actual = h('div.a.b.c')
      const expected = {
        type: 'div',
        children: [],
        css: ['a', 'b', 'c'],
        attrs: {},
        props: {},
        style: {},
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set attributes', () => {
      const actual = h('img', {attrs: {href: 'www.d11.com'}})
      const expected = {
        type: 'img',
        children: [],
        css: [],
        attrs: {href: 'www.d11.com'},
        props: {},
        style: {},
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set properties', () => {
      const actual = h('img', {props: {data: 'ABC'}})
      const expected = {
        type: 'img',
        children: [],
        css: [],
        attrs: {},
        props: {data: 'ABC'},
        style: {},
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set children', () => {
      const actual = h('ul', [h('li', ['A']), h('li', ['B'])])
      const expected = {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: ['A'],
            css: [],
            attrs: {},
            props: {},
            style: {},
            on: {}
          },
          {
            type: 'li',
            children: ['B'],
            css: [],
            attrs: {},
            props: {},
            style: {},
            on: {}
          }
        ],
        css: [],
        attrs: {},
        props: {},
        style: {},
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set styles', () => {
      const actual = h('img', {style: {display: 'none'}})
      const expected = {
        type: 'img',
        style: {
          display: 'none'
        },
        css: [],
        attrs: {},
        props: {},
        children: [],
        on: {}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set event listeners', () => {
      const click = () => void 0
      const actual = h('img', {on: {click: click}})
      const expected = {
        type: 'img',
        style: {},
        css: [],
        attrs: {},
        props: {},
        children: [],
        on: {click: click}
      }
      assert.deepEqual(actual, expected)
    })

    it('should set options and children together', () => {
      const actual = h('ul', {style: {s: 0}, attrs: {a: 1}, props: {p: 2}}, [
        h('li', ['A'])
      ])
      const expected = {
        type: 'ul',
        style: {
          s: '0'
        },
        attrs: {a: 1},
        props: {p: 2},
        css: [],
        children: [
          {
            type: 'li',
            css: [],
            attrs: {},
            props: {},
            children: ['A'],
            on: {},
            style: {}
          }
        ],
        on: {}
      }
      assert.deepEqual(actual, expected)
    })
  })

  describe('args', () => {
    const options = {attrs: {href: 'www.com'}}
    const sel = 'div'
    const children = ['A', 'B']
    it('should work with 3 args', () => {
      const actual = args(sel, options, children)
      const expected = [
        sel,
        {
          attrs: options.attrs,
          props: {},
          style: {},
          on: {}
        },
        children
      ]
      assert.deepEqual(actual, expected)
    })

    it('should work with 2 args', () => {
      const actual = args(sel, options)
      const expected = [
        sel,
        {attrs: options.attrs, props: {}, style: {}, on: {}},
        []
      ]
      assert.deepEqual(actual, expected)
    })

    it('should work with multiple options', () => {
      const options = {style: {s: 0}, attrs: {a: 1}, props: {p: 2}}
      const actual = args(sel, options, [])

      const expected = [
        sel,
        {style: {s: 0}, attrs: {a: 1}, props: {p: 2}, on: {}},
        []
      ]
      assert.deepEqual(actual, expected)
    })

    it('should work when 2nd arg is an array', () => {
      const actual = args(sel, children)
      const expected = [
        sel,
        {attrs: {}, props: {}, style: {}, on: {}},
        children
      ]
      assert.deepEqual(actual, expected)
    })
  })
})
