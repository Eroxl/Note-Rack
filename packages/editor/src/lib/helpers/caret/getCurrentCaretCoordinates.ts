import isAfterNewLine from './isAfterNewLine';

/**
 * Get the carets coordinates in the window
 * @returns The carets coordinates in the window or undefined if the caret is not in the window
 */
const getCurrentCaretCoordinates = (): { x: number, y: number } | undefined => {
  const selection = window.getSelection();

  if (!selection) return undefined;

  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true);

  const rect = range.getClientRects()[0];

  if (!rect) return undefined;

  // ~ Hack because if the caret is at the end of a line, the
  //   rect will be the end of the line
  if (isAfterNewLine(range)) {
    return {
      x: rect.left,
      y: rect.top + rect.height,
    };
  }

  return {
    x: rect.left,
    y: rect.top,
  };
};

export default getCurrentCaretCoordinates;
