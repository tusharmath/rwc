/**
 * Created by tushar on 03/09/17.
 */
import * as assert from 'assert'
import {JSDOM} from 'jsdom'
import {h} from '../src/hyperscript'
import {patch} from '../src/patch'

describe('patch', function() {
  beforeEach(function() {
    const window = new JSDOM().window
    const document = (this.document = window.document)
    this.patch = patch(window)
    this.element = document.createElement('a')
    this.tmpl = (tmpl: string) => {
      const node = document.createElement('div')
      node.innerHTML = tmpl
      return node.firstChild
    }
  })

  it('should set attributes', function() {
    this.patch(this.element, h('a', {attrs: {href: '/a/b/c'}}))
    const actual = this.element.outerHTML
    const expected = `<a href="/a/b/c" class=""></a>`
    assert.equal(actual, expected)
  })

  it('should update classes', function() {
    this.patch(this.element, h('a.c1.c2.c3'))
    const actual = this.element.outerHTML
    const expected = `<a class="c1 c2 c3"></a>`
    assert.equal(actual, expected)
  })

  it('should add unique classes', function() {
    const element = this.tmpl(`<a class="c1"></a>`)
    this.patch(element, h('a.c1.c2.c3'))
    const actual = element.outerHTML
    const expected = `<a class="c1 c2 c3"></a>`
    assert.equal(actual, expected)
  })

  it('should remove classes', function() {
    const element = this.tmpl(`<a class="c1"></a>`)
    this.patch(element, h('a.c2.c3'))
    const actual = element.outerHTML
    const expected = `<a class="c2 c3"></a>`
    assert.equal(actual, expected)
  })

  it('should set eventListeners', function() {
    const click = () => void 0
    this.patch(this.element, h('a', {on: {click: click}}))
    const actual = this.element.onclick
    const expected = click
    assert.equal(actual, expected)
  })

  it('should set props', function() {
    this.patch(this.element, h('a', {props: {data: 'AAA'}}))
    const actual = this.element.data
    const expected = 'AAA'
    assert.equal(actual, expected)
  })

  it('should set style', function() {
    this.patch(this.element, h('a', {style: {display: 'none'}}))
    const actual = this.element.style.display
    const expected = 'none'
    assert.equal(actual, expected)
  })

  it('should set text', function() {
    this.patch(this.element, h('a', ['A']))
    const actual = this.element.innerHTML
    const expected = 'A'
    assert.strictEqual(actual, expected)
  })

  it('should patch children', function() {
    const element: HTMLElement = this.tmpl(
      ['<ul>', '<li>A</li>', '<li>B</li>', '<li>C</li>', '</ul>'].join('')
    )
    this.patch(
      element,
      h('ul', [h('li', ['A']), h('li', ['BB']), h('li', ['C'])])
    )
    assert.equal(
      element.innerHTML,
      [
        '<li class="">A</li>',
        '<li class="">BB</li>',
        '<li class="">C</li>'
      ].join('')
    )
  })
})
