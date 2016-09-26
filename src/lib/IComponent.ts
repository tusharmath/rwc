/**
 * Created by tushar.mathur on 25/09/16.
 */


import {IState} from './IState';
import {ITask} from './ITask';
import {IVirtualNode} from './IVirtualNode';
import {IAction} from './IAction';
import {IShadowElement} from './IShadowElement';

export interface IComponent {
  props: Array<String>;
  init (el: IShadowElement): IState;
  update (state: IState, action: IAction): IState | [IState, ITask];
  view (state: IState, dispatch: Function): IVirtualNode;
}
