import type PageDataInterface from '../types/pageTypes';

const getFirstLineLength = (node: HTMLElement): number => {
  // ~ Get the first newline character
  const newlineIndex = node.innerText.slice(0, -1).indexOf('\n') || -1;

  // ~ If there is no newline character, return the length of the text
  if (newlineIndex === -1) return node.textContent?.length || 0;

  // ~ If there is a newline character, return the index of the newline character
  return newlineIndex;
};

const getLengthExcludingLastLine = (node: HTMLElement): number => {
  // ~ Get the 2nd last newline character
  const newlineIndex = node.innerText.slice(0, -1).lastIndexOf('\n') || -1;
  let lastTextNode = node.nodeName === '#text' ? node : node.lastChild;

  while (lastTextNode?.nodeName !== '#text') {
    const newLastTextNode = lastTextNode?.previousSibling;

    if (!newLastTextNode) return 0;

    lastTextNode = newLastTextNode;
  }

  lastTextNode = lastTextNode as Text;

  const range = document.createRange();

  if (!lastTextNode.textContent) return node.textContent?.length || 0;

  const textNodeLength = lastTextNode.textContent.length - 1;

  for (let i = textNodeLength; i >= 0; i -= 1) {
    range.setStart(lastTextNode, i);
    range.setEnd(lastTextNode, textNodeLength);

    const rectLength = (range.getClientRects()?.length || 1) - 1;

    if (rectLength > 0) {
      const artificialLastLine = (node.textContent?.length || 0) - (textNodeLength - i + 1);

      if (newlineIndex >= artificialLastLine) {
        return newlineIndex;
      }

      return artificialLastLine;
    }
  }

  if (newlineIndex === -1) return 0;

  return newlineIndex;
};

const getClosestTextNode = (node: Node): Node[] => {
  // ~ Get all the text nodes in the element
  const textNodes = [];

  // ~ Get all text nodes or br elements
  const iterator = document.createNodeIterator(
    node,
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
  if (textNodes.length === 0) return [node];

  // ~ Return the text nodes
  return textNodes;
};

const getNextEditableBlock = (
  index: number,
  pageData: PageDataInterface['message'],
  direction: 'up' | 'down' = 'up',
): HTMLElement | undefined => {
  if (!pageData) return undefined;

  if (direction === 'up') {
    // ~ Find the previous editable block
    while (index > 0) {
      index -= 1;

      const block = document.getElementById(pageData.data[index]._id);
      if (block?.getAttribute('contenteditable') === 'true') {
        return block;
      }
    }

    // ~ If there is no previous editable block, focus the first editable block
    const block = document.getElementById('page-title')?.firstChild;
    if (!block) return undefined;

    return block as HTMLElement;
  }

  // ~ Find the next editable block
  while (index < pageData.data.length - 1) {
    index += 1;

    const block = document.getElementById(pageData.data[index]._id);
    if (block?.getAttribute('contenteditable') === 'true') {
      return block;
    }
  }

  return undefined;
};

/**
 * Select the end of the element
 * @param element The element to focus
 */
const selectEnd = (element: HTMLElement, position: number) => {
  element.focus();

  // ~ Move the cursor to the end of the block unless the only text is a newline
  if (element.textContent === '\n') return;

  const range = document.createRange();
  const sel = window.getSelection();

  const textNodes = getClosestTextNode(element);

  if (position === -1) {
    const lastTextNode = textNodes.slice(-1)[0];

    if (lastTextNode.textContent?.at(-1) === '\n') {
      range.setStart(lastTextNode, Math.max(lastTextNode.textContent.length - 1, 0));
    } else {
      range.setStart(lastTextNode, lastTextNode.textContent?.length || 0);
    }
  } else {
    textNodes.forEach((node) => {
      if (position < 0) return;

      const length = node.nodeName === '#text'
        ? node.textContent?.length || 0
        : 1;

      position -= length;

      if (position <= 0 || node === textNodes[textNodes.length - 1]) {
        const index = Math.max(Math.min(position + length, length), 0);

        if (node.textContent?.at(index - 1) === '\n') {
          range.setStart(node, Math.max(index - 1, 0));
        } else {
          range.setStart(node, index);
        }

        position = -1;
      }
    });
  }

  sel?.removeAllRanges();
  sel?.addRange(range);
};

const focusBlockAtIndex = (
  index: number,
  pageData: PageDataInterface['message'],
) => {
  const block = getNextEditableBlock(index, pageData);
  if (!block) return;

  // ~ Focus the block
  selectEnd(block, -1);
};

const focusBlockAtIndexRelativeToTop = (
  index: number,
  pageData: PageDataInterface['message'],
  position: number,
) => {
  const block = getNextEditableBlock(index, pageData, 'down');
  if (!block) return;

  const offset = Math.min(position, getFirstLineLength(block));

  // ~ Focus the block
  selectEnd(block, offset);
};

const focusBlockAtIndexRelativeToBottom = (
  index: number,
  pageData: PageDataInterface['message'],
  position: number,
) => {
  const block = getNextEditableBlock(index, pageData);
  if (!block) return;

  let lengthExcludingLastLine = getLengthExcludingLastLine(block);

  if (lengthExcludingLastLine !== 0) {
    lengthExcludingLastLine += 1;
  }

  const offset = Math.min(
    lengthExcludingLastLine + position,
    block.textContent?.length || 0,
  );

  // ~ Focus the block
  selectEnd(block, offset);
};

/**
   * Get the x and y coordinates of a cursor at a given offset
   * @param offset Offset of the cursor
   * @returns X and y coordinates of the cursor
   */
const getCaretCoordinatesFromOffset = (element: HTMLElement, offset: number): { x: number, y: number } => {
  const range = document.createRange();

  const textNodes = getClosestTextNode(element);

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

export {
  focusBlockAtIndex,
  focusBlockAtIndexRelativeToTop,
  focusBlockAtIndexRelativeToBottom,
  getLengthExcludingLastLine,
  getClosestTextNode,
  getCaretCoordinatesFromOffset,
};
