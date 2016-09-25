/**
 * Created by tushar.mathur on 25/09/16.
 */

import IState from './IState';
import IAction from './IAction';
interface IReducer {
  (state: IState, action: IAction): IState
}

export default IReducer
