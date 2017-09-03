/**
 * Created by tushar on 03/09/17.
 */
import {VElement} from './hyperscript'

const forEach = <T>(fn: (t: any, name: keyof T) => void, obj: T) => {
  for (let prop in obj) fn(obj[prop], prop)
}
const setProp = (prop: string, value: any, obj: any) => (obj[prop] = value)
export const patch = ({document}: Window) => (
  element: HTMLElement,
  vElement: VElement
) => {
  // update attrs
  forEach((value, name) => element.setAttribute(name, value), vElement.attrs)

  // update css
  setProp('classList', vElement.css.join(' '), element)

  // update eventListeners
  forEach((value, name) => setProp(`on${name}`, value, element), vElement.on)

  // update props
  forEach((value, name) => setProp(name, value, element), vElement.props)

  // update style
  forEach((value, name) => setProp(name, value, element.style), vElement.style)
}
