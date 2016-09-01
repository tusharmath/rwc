/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

import rwc from '../src'
import test from 'ava'

test('is function ', t => t.is(typeof rwc.createWCProto, 'function'))
