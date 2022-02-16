const moveCursor = (element: HTMLSpanElement, position: number, endPos?: number) => {
  element.focus();

  const range = new Range();
  range.setStart(element.firstChild as HTMLSpanElement, position);
  range.setEnd(element.firstChild as HTMLSpanElement, endPos ?? position);

  document.getSelection()?.removeAllRanges();
  document.getSelection()?.addRange(range);
};

const getCursor = (parentElement: HTMLElement): [Node | undefined, number] => {
  const currentSel = document.getSelection();
  const selNode = currentSel?.anchorNode;
  const returnNode = (selNode && parentElement.contains(selNode)) ? selNode : undefined;

  return [returnNode, currentSel?.getRangeAt(0).startOffset ?? 0];
};

export { moveCursor, getCursor };
