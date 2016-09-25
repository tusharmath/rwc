/**
 * Created by tushar.mathur on 25/09/16.
 */

import ReactiveHTMLElement from '../ReactiveHTMLElement';

interface ITask {
  run (el: ReactiveHTMLElement, dispatch: Function): void
}

export default ITask
