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

  if (selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);

  if (!range) return 0;

  try {
    // ~ Clone the range and select the contents of the element
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);

    // ~ Set the end of the range to the start of the selection
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    // ~ Return the length between the start of the element and the cursor
    return preCaretRange.toString().length;
  } catch (error) {
    // ~ If there is an error, return 0
    return 0;
  }
};

export default getCursorOffset;
