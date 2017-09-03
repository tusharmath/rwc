/**
 * Created by tushar on 03/09/17.
 */

type AttributeSet = {[key: string]: string | number}
type Children = Array<VNode | string>
type CSS = Array<string>
type EventSet = {[key: string]: EventListener}
type PropSet = {[key: string]: any}
type StyleSet = {[key: string]: string|number}
type TYPE = string

interface VNode {
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

export const defaultOPT = (i?: Options) =>
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

export function h(selector: string, options: Options, children: Children): VNode
export function h(selector: string, children: Children): VNode
export function h(selector: string, options: Options): VNode
export function h(selector: string): VNode
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
