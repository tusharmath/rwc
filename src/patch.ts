/**
 * Created by tushar on 03/09/17.
 */
import {VElement} from './hyperscript'

const forEach = <T>(fn: (t: any, name: keyof T) => void, obj: T) => {
  for (let prop in obj) fn(obj[prop], prop)
}
const setProp = (prop: string, value: any, obj: any) => (obj[prop] = value)
export const patch = ({document}: Window) =>
  function patch(element: HTMLElement, vElement: VElement) {
    /**
     * attrs
     */
    forEach((value, name) => element.setAttribute(name, value), vElement.attrs)

    /**
     * css
     */
    setProp('classList', vElement.css.join(' '), element)

    /**
     * eventListeners
     */
    forEach((value, name) => setProp(`on${name}`, value, element), vElement.on)

    /**
     * props
     */
    forEach((value, name) => setProp(name, value, element), vElement.props)

    /**
     * style
     */
    forEach(
      (value, name) => setProp(name, value, element.style),
      vElement.style
    )

    /**
     * children
     */
    const elementChildren = Array.from(element.children) as HTMLElement[]
    Array.from(vElement.children).forEach(
      (vElement, i) =>
        typeof vElement === 'string'
          ? (element.innerHTML = vElement)
          : patch(elementChildren[i], vElement)
    )
  }
