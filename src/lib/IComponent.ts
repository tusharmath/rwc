/**
 * Created by tushar.mathur on 25/09/16.
 */


import IState from './IState';
import ITask from './ITask';
import IVirtualNode from './IVirtualNode';
import IAction from './IAction';
import ReactiveHTMLElement from '../ReactiveHTMLElement';

interface IComponent {
  props: Array<String>;
  init (el: ReactiveHTMLElement): IState;
  update (state: IState, action: IAction): IState | [IState, ITask];
  view (state: IState, dispatch: Function): IVirtualNode;
}

export default IComponent;
