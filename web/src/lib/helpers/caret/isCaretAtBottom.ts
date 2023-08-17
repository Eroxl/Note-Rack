import getStyleScale from "../getStyleScale";
import isElementFocused from '../isElementFocused';
import getCurrentCaretCoordinates from "./getCurrentCaretCoordinates";

const isCaretAtBottom = (element: HTMLElement) => {
  // ~ Check if the element is focused
  if (!isElementFocused(element)) return false;

  const caretCoordinates = getCurrentCaretCoordinates();

  if (!caretCoordinates) return false;

  const { y } = caretCoordinates;

  // ~ Get the caret position relative to the bottom of the element
  const bottomPadding = getStyleScale(element, 'paddingBottom');

  const elementPosition = element.getBoundingClientRect().bottom - bottomPadding;

  let lineHeight = getStyleScale(element, 'lineHeight');
  const fontSize = getStyleScale(element, 'fontSize');

  if (Number.isNaN(lineHeight)) lineHeight = 1.2;

  const caretPosition = (elementPosition - y) - lineHeight - fontSize;
  
  // ~ Check if the caret is at the bottom of the element (within 5px)
  return caretPosition < 5;
};

export default isCaretAtBottom;
