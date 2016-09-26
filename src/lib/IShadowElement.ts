/**
 * Created by tushar.mathur on 25/09/16.
 */

export interface IShadowElement {
  createdCallback (): void
  attachedCallback (): void
  attributeChangedCallback (name: string, old: string, current: string): void
  detachedCallback (): void
}
