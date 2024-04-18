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
 */
const focusElement = (element: HTMLElement, offset: number = 0) => {
  element.focus();

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

  let lastSelectableElement: HTMLElement | undefined;

  while (iterator.nextNode()) {
    const node = iterator.referenceNode;

    if (checkTreeForContentEditable(getFirstTextNode(node as HTMLElement) as HTMLElement)) {
      lastSelectableElement = node as HTMLElement;
    }
    
    const length = node.nodeName === '#text'
      ? node.textContent?.length || 0
      : 1;

    offset -= length;

    if (offset < 0) {
      if (!checkTreeForContentEditable(node as HTMLElement) && lastSelectableElement) {
        range.setStart(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
        break
      }

      const index = Math.max(Math.min(offset + length, length), 0);

      range.setStart(node, index);
      break;
    }
  }

  if (offset > 0) {
    if (checkTreeForContentEditable(getFirstTextNode(iterator.referenceNode as HTMLElement) as HTMLElement)) {
      range.setStart(iterator.referenceNode, iterator.referenceNode.textContent?.length || 0);
    } else if (lastSelectableElement) {
      range.setStart(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
    }
  }
  else if (offset === 0 && range.startContainer === document) {
    if (checkTreeForContentEditable(getFirstTextNode(iterator.referenceNode as HTMLElement) as HTMLElement)) {
      range.setStart(iterator.referenceNode, 0);
    } else if (lastSelectableElement) {
      range.setStart(lastSelectableElement, lastSelectableElement.textContent?.length || 0)
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);
};

export default focusElement;
