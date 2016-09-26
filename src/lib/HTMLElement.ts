/**
 * Created by tushar.mathur on 25/09/16.
 */

import {HTMLElement as a} from 'window-or-global';
import {HTMLElementShim} from './HTMLElementShim';
export const HTMLElement = a || HTMLElementShim
