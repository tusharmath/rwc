/**
 * Created by tushar.mathur on 25/09/16.
 */

import ReactiveHTMLElement from './ReactiveHTMLElement';
import IPatch from './lib/IPatch';
import IComponent from './lib/IComponent';

function createWCProto (patcher: IPatch, component: IComponent) {
  return ReactiveHTMLElement.of(patcher, component)
}

export default {createWCProto, ReactiveHTMLElement}
