/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import registerElement from './registerElement'
import createWC from './createWC'

export default function registerWC (name, params) {
  const prototype = createWC(params)
  registerElement(name, {prototype})
}
