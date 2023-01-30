/**
 * Returns a string representation of the text content of the provided element and
 * all its children.
 *
 * The text representation is a concatenation of the `textContent` property of
 * each child node, with the exception of the special case of `HTMLSpanElement`
 * nodes. If a child node is a `HTMLSpanElement` and it has a `data-plaintext-keybind`
 * attribute, the text representation will be the value of that attribute, followed
 * by the text representation of all the child nodes, followed by the same value
 * of the `data-plaintext-keybind` attribute.
 *
 * This function will return "__**Bold + Underlined**__".
 *
 * @param element The element whose text representation to get.
 * @returns The text representation of the element.
 * 
 * @example
 * // The current element is:
 * // <span data-plaintext-keybind="**" id="element">
 * //   <span data-plaintext-keybind="__">Bold + Underlined</span>
 * // </span>
 * 
 * const element = document.getElementById('element');
 * 
 * const textRepresentation = getElementTextRepresentation(element);
 * 
 * console.log(textRepresentation);
 * // "**Bold + Underlined**"
 */

const getElementTextRepresentation = (element: HTMLSpanElement) => {
  let output = '';

  const plaintextValue = element?.dataset?.plaintextKeybind;

  if (plaintextValue) {
    const childRepresentations = Array
      .from(element.childNodes)
      .map((child) => getElementTextRepresentation(child as HTMLSpanElement))
      .join('');

    output = `${plaintextValue}${childRepresentations}${plaintextValue}`;
  } else {
    output = element.textContent || '';
  }

  return output;
};

/**
 * This function returns the text representation of the element's children.
 * @param element The element whose text representation to get.
 * @returns The text representation of the element's children.
 * 
 * @example
 * // The current element is:
 * // <div id="element">
 * //   <span data-plaintext-keybind="**">
 * //     <span data-plaintext-keybind="__">Bold + Underlined</span>
 * //   </span>
 * // </div>
 * 
 * const element = document.getElementById('element');
 * 
 * const textRepresentation = getTextRepresentation(element);
 * 
 * console.log(textRepresentation);
 * // "**Bold + Underlined**"
 */
const getTextRepresentation = (element: HTMLSpanElement) => {
  return Array
    .from(element.childNodes)
    .map((child) => getElementTextRepresentation(child as HTMLSpanElement))
    .join('');
};


export default getTextRepresentation;
