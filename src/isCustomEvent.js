/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import root from 'window-or-global'

export class CustomEvent {
  static of (...args) {
    if (root.CustomEvent) return new root.CustomEvent(...args)
    return new CustomEvent(...args)
  }

  static is (event) {
    return event instanceof CustomEvent || root.CustomEvent
  }
}
export default function (event) {
  return CustomEvent.is(event)
}
