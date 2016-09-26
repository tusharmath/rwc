/**
 * Created by tushar.mathur on 25/09/16.
 */

import {IState} from './IState';
import {IAction} from './IAction';
export interface IReducer {
  (state: IState, action: IAction): IState
}
