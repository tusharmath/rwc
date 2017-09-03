/**
 * Created by tushar on 22/01/17.
 */

interface CustomElement {
  /**
   * Called when the element is inserted into a document, including into a shadow tree
   */

  connectedCallback(): void

  /**
   window: any;
   window: any;
   * Called when the element is removed from a document
   */

  disconnectedCallback(): void

  /**
   * Called when an attribute is changed, appended, removed, or replaced on the element. Only called for observed attributes.
   */

  attributeChangedCallback(
    attributeName: string,
    oldValue: string,
    newValue: string,
    namespace: string
  ): void

  /**
   * Called when the element is adopted into a new document
   */
  adoptedCallback(
    oldDocument: DocumentFragment,
    newDocument: DocumentFragment
  ): void
}

declare module 'jsdom' {
  export class JSDOM {
    window: Window
  }
}
