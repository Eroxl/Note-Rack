import getCaretCoordinates from '../getCaretCoordinates';

const isElementFocused = (element: HTMLElement) => (
  document.activeElement === element
  || element.contains(document.activeElement)
);

const getStyle = (element: HTMLElement, style: string) => +window.getComputedStyle(element).getPropertyValue(style).replace('px', '');

const isCaretAtTop = (element: HTMLElement) => {
  // ~ Check if the element is focused
  if (!isElementFocused(element)) return false;

  const caretCoordinates = getCaretCoordinates();

  if (!caretCoordinates) return false;

  const { y } = caretCoordinates;

  // ~ Get the caret position relative to the element
  const topPadding = getStyle(element, 'padding-top');
  const elementPosition = element.getBoundingClientRect().top + topPadding;
  const caretPosition = y - elementPosition;

  // ~ Check if the caret is at the top of the element (within 5px)
  return caretPosition < 5;
};

const isCaretAtBottom = (element: HTMLElement) => {
  // ~ Check if the element is focused
  if (!isElementFocused(element)) return false;

  const caretCoordinates = getCaretCoordinates();

  if (!caretCoordinates) return false;

  const { y } = caretCoordinates;

  // ~ Get the caret position relative to the bottom of the element
  const bottomPadding = getStyle(element, 'padding-bottom');
  const elementPosition = element.getBoundingClientRect().bottom - bottomPadding;

  const caretPosition = (elementPosition - y) - getStyle(element, 'line-height');

  // ~ Check if the caret is at the bottom of the element (within 5px)
  return caretPosition < 5;
};

/**
   * Get the number of characters between the start of the element and the
   * cursor
   * @param element Element to get the cursor offset for
   * @returns Number of characters between the start of the element and the
   */
const getCursorOffset = (element: HTMLElement): number => {
  // ~ Get the range and selection
  const selection = window.getSelection();

  if (!selection) return 0;

  const range = selection.getRangeAt(0);

  if (!range) return 0;

  // ~ Clone the range and select the contents of the element
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);

  // ~ Set the end of the range to the start of the selection
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  // ~ Return the length between the start of the element and the cursor
  return preCaretRange.toString().length;
};

export { isCaretAtTop, isCaretAtBottom, getCursorOffset };
