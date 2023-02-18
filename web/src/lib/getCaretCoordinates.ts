const isAfterNewLine = (range: Range) => {
  const text = range.startContainer.textContent;
  const char = text && text[range.startOffset - 1];

  return char === "\n";
};

const getCaretCoordinates = () => {
  const selection = window.getSelection();

  if (!selection) return;

  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true);

  const rect = range.getClientRects()[0];

  if (!rect) return;
    
  if (isAfterNewLine(range)) {
    return {
      x: rect.left,
      y: rect.top + rect.height,
    }
  }

  return {
    x: rect.left,
    y: rect.top,
  };
};

export default getCaretCoordinates;
