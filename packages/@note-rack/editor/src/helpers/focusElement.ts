/**
 * Gets all the text nodes in an element
 * @param element The element to get the text nodes from
 * @returns All the text nodes in the element
 */
export const getAllTextNodes = (element: HTMLElement): Node[] => {
  // ~ Get all the text nodes in the element
  const textNodes = [];

  // ~ Get all text nodes or br elements
  const iterator = document.createNodeIterator(
    element,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (childNode) => {
        if (childNode.nodeName === 'BR') return NodeFilter.FILTER_ACCEPT;
        if (childNode.nodeName === '#text') return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let nextNode = iterator.nextNode();
  while (nextNode) {
    textNodes.push(nextNode);

    nextNode = iterator.nextNode();
  }

  // ~ If there are no text nodes, return the element
  if (textNodes.length === 0) return [element];

  // ~ Return the text nodes
  return textNodes;
};

/**
 * Focuses an element
 * @param element The element to focus
 * @param offset The offset to move the cursor to
 */
const focusElement = (element: HTMLElement, offset: number = 0) => {
  element.focus();

  // ~ Move the cursor to the end of the block unless the only text is a newline
  if (element.textContent === '\n') return;

  const range = document.createRange();
  const selection = window.getSelection();

  if (!selection) return;

  const iterator = document.createNodeIterator(
    element,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (childNode) => {
        if (childNode.nodeName === 'BR') return NodeFilter.FILTER_ACCEPT;
        if (childNode.nodeName === '#text') return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  while (iterator.nextNode()) {
    const node = iterator.referenceNode;

    const length = node.nodeName === '#text'
      ? node.textContent?.length || 0
      : 1;

    offset -= length;

    if (offset <= 0) {
      const index = Math.max(Math.min(offset + length, length), 0);

      if (node.textContent?.at(index - 1) === '\n') {
        range.setStart(node, Math.max(index - 1, 0));
      } else {
        range.setStart(node, index);
      }

      break;
    }
  }

  if (offset > 0) {
    range.setStart(iterator.referenceNode, iterator.referenceNode.textContent?.length || 0);
  }

  selection.removeAllRanges();
  selection.addRange(range);
};

export default focusElement;
