/**
 * Created by tushar.mathur on 25/09/16.
 */

import {IVirtualNode} from './IVirtualNode';

export interface IPatch {
  (el: Node): (vNode: IVirtualNode) => void
}
