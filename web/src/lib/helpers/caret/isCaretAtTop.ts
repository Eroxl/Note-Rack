import getStyleScale from "../getStyleScale";
import isElementFocused from '../isElementFocused';
import getCurrentCaretCoordinates from "./getCurrentCaretCoordinates";

const isCaretAtTop = (element: HTMLElement) => {
  // ~ Check if the element is focused
  if (!isElementFocused(element)) return false;

  const caretCoordinates = getCurrentCaretCoordinates();

  if (!caretCoordinates) return false;

  const { y } = caretCoordinates;

  // ~ Get the caret position relative to the element
  const topPadding = getStyleScale(element, 'paddingTop');
  const elementPosition = element.getBoundingClientRect().top + topPadding;
  const caretPosition = y - elementPosition;

  // ~ Check if the caret is at the top of the element (within 5px)
  return caretPosition < 5;
};

export default isCaretAtTop;
