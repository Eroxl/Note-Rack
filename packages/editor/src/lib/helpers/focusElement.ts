export const getFirstTextNode = (element: HTMLElement): Node | null => {
  if (element.nodeType === Node.TEXT_NODE) return element;

  for (let i = 0; i < element.childNodes.length; i += 1) {
    const node = element.childNodes[i];
    const textNode = getFirstTextNode(node as HTMLElement);

    if (textNode) return textNode;
  }

  return null;
}

export const checkTreeForContentEditable = (element: HTMLElement): boolean => {
  if (element.isContentEditable) return true;
  else if (
    (element as Node) === document 
    || !element.parentElement
    || element.isContentEditable === false
  ) return false;

  return checkTreeForContentEditable(element.parentElement);
}

/**
 * Focuses an element
 * @param element The element to focus
 * @param offset The offset to move the cursor to
 * @param length The length between the start of the cursor and the end 
 */
const focusElement = (
  element: HTMLElement,
  offset: number = 0,
  length: number = 0,
) => {
  const isCollapsed = length === 0;

  element.focus();

  console.log(`Moved Caret: \n- Element:`,  element, `\n- Offset: ${offset}\n- Length: ${length}`);

  // ~ Move the cursor to the end of the block unless the only text is a newline
  if (element.textContent === '\n' || element.textContent === '') {
    const firstTextNode = getFirstTextNode(element);

    const range = document.createRange();
    const selection = window.getSelection();

    if (!selection || !firstTextNode) return;

    range.setStart(firstTextNode, 0);

    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }

  const range = document.createRange();
  const selection = window.getSelection();

  if (!selection) return;

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

  let currentOffset = 0;

  let lastSelectableElement: HTMLElement | undefined;

  while (iterator.nextNode()) {
    const node = iterator.referenceNode;

    console.log(node);

    if ((node as HTMLElement).isContentEditable) {
      lastSelectableElement = node as HTMLElement;
    }

    const nodeLength = node.nodeName === '#text'
      ? node.textContent?.length || 0
      : 1;

    currentOffset += nodeLength;

    if (currentOffset >= offset && range.startContainer === document) {
      const index = Math.max(
        Math.min(
          offset - (currentOffset - nodeLength),
          nodeLength
        ),
        0
      )

      const isNodeEditable = checkTreeForContentEditable(node as HTMLElement);

      if (
        !isCollapsed
        || isNodeEditable
      ) {
        range.setStart(node, index);
      } else if (lastSelectableElement) {
        range.setStart(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
      }

      if (isCollapsed) {
        break;
      }
    }

    if (
      currentOffset >= offset + length
      && range.endContainer === range.startContainer
    ) {
      const index = Math.max(
        Math.min(
          offset + length - (currentOffset - nodeLength),
          nodeLength
        ),
        0
      )

      const isNodeEditable = checkTreeForContentEditable(node as HTMLElement);

      if (
        !isCollapsed
        || isNodeEditable
      ) {
        range.setEnd(node, index);
      } else if(lastSelectableElement) {
        range.setEnd(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
      }

      break;
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);
  
  element.style.caretColor = 'auto';
};

export default focusElement;
