/**
 * Created by tushar.mathur on 30/09/16.
 */

function notConstructor (t: string) {
  return t !== 'constructor'
}
export function assignOwnProperties (dest: Object, source: Object) {
  const props = Object.getOwnPropertyNames(source)
  props.filter(notConstructor).forEach(p => dest[p] = source[p])
  return dest
}
