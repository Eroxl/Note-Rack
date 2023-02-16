import type PageDataInterface from '../../types/pageTypes';

const getFirstLineLength = (node: HTMLElement): number => {
  // ~ Get the first newline character
  const newlineIndex = node.innerText?.slice(0, -1).indexOf('\n') || -1;

  // ~ If there is no newline character, return the length of the text
  if (newlineIndex === -1) return node.textContent?.length || 0;

  // ~ If there is a newline character, return the index of the newline character
  return newlineIndex;
};

const getLengthExcludingLastLine = (node: HTMLElement): number => {
  // ~ Get the 2nd last newline character
  const newlineIndex = node.innerText?.slice(0, -1).lastIndexOf('\n') || -1;

  // ~ If there is no newline character, return 0
  if (newlineIndex === -1) return 0;

  // ~ If there is a newline character, return the index of the newline character
  return newlineIndex + 1;
};

const getClosestTextNode = (node: Node): Node[] => {
  // ~ Get all the text nodes in the element
  const textNodes = [];

  let iterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT).nextNode()
  while (iterator) {
    textNodes.push(iterator);
    
    iterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT).nextNode()
    if (iterator && textNodes.includes(iterator)) break;
  }

  // ~ If there are no text nodes, return the element
  if (textNodes.length === 0) return [node];

  // ~ Return the text nodes
  return textNodes;
};

const getNextEditableBlock = (
  index: number,
  pageData: PageDataInterface,
  direction: 'up' | 'down' = 'up'
): HTMLElement | undefined => {
  if (direction === 'up') {
    // ~ Find the previous editable block
    while (index > 0) {
      index -= 1;

      const block = document.getElementById(pageData.message.data[index]._id)
      if (block?.getAttribute('contenteditable') === 'true') {
        return block;
      }
    }

    // ~ If there is no previous editable block, focus the first editable block
    const block = document.getElementById('page-title')?.firstChild;
    if (!block) return;

    return block as HTMLElement;
  }

  // ~ Find the next editable block
  while (index < pageData.message.data.length - 1) {
    index += 1;

    const block = document.getElementById(pageData.message.data[index]._id)
    if (block?.getAttribute('contenteditable') === 'true') {
      return block;
    }
  }
};

const focusBlockAtIndex = (
  index: number,
  pageData: PageDataInterface,
) => {
  const block = getNextEditableBlock(index, pageData);
  if (!block) return;

  // ~ Focus the block
  selectEnd(block, -1);
};


const focusBlockAtIndexRelativeToTop = (
  index: number,
  pageData: PageDataInterface,
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
  pageData: PageDataInterface,
  position: number,
) => {
  const block = getNextEditableBlock(index, pageData);
  if (!block) return;

  const lengthExcludingLastLine = getLengthExcludingLastLine(block);

  const offset = Math.min(
    lengthExcludingLastLine + position,
    block.textContent?.length || 0,
  );

  // ~ Focus the block
  selectEnd(block, offset);
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
    range.setStart(textNodes.slice(-1)[0], Math.min(position, element.textContent?.length || 0));
  } else {
    textNodes.forEach((node) => {
      const length = node.textContent?.length || 0;

      position -= length;

      if (position <= 0) {
        const index = Math.min(position + length, length)

        range.setStart(node, index);
      }
    });
  }

  sel?.removeAllRanges();
  sel?.addRange(range);
};

export {
  focusBlockAtIndex,
  focusBlockAtIndexRelativeToTop,
  focusBlockAtIndexRelativeToBottom,
  getLengthExcludingLastLine 
};
