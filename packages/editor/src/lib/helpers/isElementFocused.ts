/**
 * Checks if the given element is focused or contains the focused element
 * @param element The element to check
 * @returns Whether the element is focused or contains the focused element
 */
const isElementFocused = (element: HTMLElement) => (
  document.activeElement === element
  || element.contains(document.activeElement)
);

export default isElementFocused;