/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import root from 'window-or-global'

export default class Event {
  static of (...args) {
    if (root.Event) return new root.Event(...args)
    return new Event(...args)
  }

  static is (event) {
    return event instanceof Event || (
        root.Event && event instanceof root.Event
      )
  }
}
