/**
 * Get the x and y coordinates of a cursor at a given offset
 * @param offset Offset of the cursor
 * @returns X and y coordinates of the cursor
 */
const getOffsetCoordinates = (element: HTMLElement, offset: number): { x: number, y: number } => {
  const range = document.createRange();

  const iterator = document.createNodeIterator(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (childNode) => {
        if (childNode.nodeName === 'BR') return NodeFilter.FILTER_ACCEPT;
        if (childNode.nodeName === '#text') return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    },
  );
  if (!iterator.referenceNode) return { x: 0, y: 0 };

  while (iterator.nextNode()) {
    const textNode = iterator.referenceNode;

    if (!textNode) continue;

    if (textNode.textContent?.length! >= offset) {
      range.setStart(textNode, offset);
      range.collapse(true);
      break;
    }

    offset -= textNode.textContent?.length!;
  }

  const rect = range.getClientRects()[0];

  if (!rect) return { x: 0, y: 0 };

  return {
    x: rect.left,
    y: rect.top,
  };
};

export default getOffsetCoordinates;
