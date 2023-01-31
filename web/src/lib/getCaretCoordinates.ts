const getCaretCoordinates = () => {
  const selection = window.getSelection();

  if (!selection) return;

  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true);
  
  const rect = range.getClientRects()[0];
  
  if (!rect) return;
    
  return {
    x: rect.left,
    y: rect.top,
  };
};

export default getCaretCoordinates;
