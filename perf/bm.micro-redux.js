/**
 * Created by tushar.mathur on 05/09/16.
 */

'use strict'

const Store = require('../src/Store').default
const {Suite} = require('benchmark')
const suite = new Suite()
const store = Store.of(x => x, {a: 1})
store.subscribe(x => x)
suite
  .add('dispatch()', () => store.dispatch({type: 'LAME'}))
  .on('cycle', event => console.log(String(event.target)))
  .run({'async': true})
