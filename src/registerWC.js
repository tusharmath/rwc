/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import registerElement from './registerElement'
import createProto from './createProto'

export default function registerWC (name, params) {
  const prototype = createProto(params)
  registerElement(name, {prototype})
}
