import getCaretCoordinates from '../getCaretCoordinates';

const isElementFocused = (element: HTMLElement) => document.activeElement === element || element.contains(document.activeElement);

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
}

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
}

export { isCaretAtTop, isCaretAtBottom };
