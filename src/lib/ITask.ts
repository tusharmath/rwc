/**
 * Created by tushar.mathur on 25/09/16.
 */

import {IShadowElement} from './IShadowElement';

export interface ITask {
  run (el: IShadowElement, dispatch: Function): void
}
