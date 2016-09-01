/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

/* global HTMLElement */

export default function __registerElement (name, proto) {
  const __proto = Object.assign(Object.create(HTMLElement.prototype), proto)
  document.registerElement(name, __proto)
}
