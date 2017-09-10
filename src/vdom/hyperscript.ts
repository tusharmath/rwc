/**
 * Created by tushar on 03/09/17.
 */

type AttributeSet = {[key: string]: string | number}
type Children = Array<VElement | string>
type CSS = Array<string>
type EventSet = {[key: string]: EventListener}
type PropSet = {[key: string]: any}
type StyleSet = {[key: string]: string|number}
type TYPE = string

export interface VElement {
  attrs: AttributeSet
  children: Children
  css: CSS
  on: EventSet
  props: PropSet
  style: StyleSet
  type: TYPE
}

type Options = {
  attrs?: AttributeSet
  on?: EventSet
  props?: PropSet
  style?: StyleSet
}

const defaultOPT = (i?: Options) =>
  Object.assign(
    {
      attrs: {},
      props: {},
      style: {},
      on: {}
    },
    i
  )
export const args = (...t: any[]): [string, Options, Children] => {
  if (t.length === 3) return [t[0], defaultOPT(t[1]), t[2]]
  if (t.length === 2 && Array.isArray(t[1]))
    return args(t[0], defaultOPT(), t[1])
  return args(t[0], defaultOPT(t[1]), [])
}

export function h(selector: string, options: Options, children: Children): VElement
export function h(selector: string, children: Children): VElement
export function h(selector: string, options: Options): VElement
export function h(selector: string): VElement
export function h(...t: any[]) {
  const [selector, {attrs, props, style, on}, children] = args(...t)
  const [type, ...css] = selector.split('.')
  return {
    attrs,
    children,
    css,
    on,
    props,
    style,
    type
  }
}
