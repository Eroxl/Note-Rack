import { getAllTextNodes } from "./focusElement";

/**
 * Get the x and y coordinates of a cursor at a given offset
 * @param offset Offset of the cursor
 * @returns X and y coordinates of the cursor
 */
const getOffsetCoordinates = (element: HTMLElement, offset: number): { x: number, y: number } => {
  const range = document.createRange();

  const textNodes = getAllTextNodes(element);

  if (!textNodes) return { x: 0, y: 0 };

  for (let i = 0; i < textNodes.length; i++) {
    const textNode = textNodes[i];

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
