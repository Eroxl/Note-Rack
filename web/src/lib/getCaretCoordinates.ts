import { getLengthExcludingLastLine } from './helpers/focusHelpers';

const isAfterNewLine = (range: Range) => {
  if (range.startOffset === 0) return false;

  if (!range.startContainer) return false;

  const lengthExcludingLastLine = getLengthExcludingLastLine(
    range.startContainer.parentElement || range.startContainer as HTMLElement,
  );

  if (lengthExcludingLastLine === 0) return false;

  return lengthExcludingLastLine + 1 === range.startOffset;
};

const getCaretCoordinates = (): { x: number, y: number } | undefined => {
  const selection = window.getSelection();

  if (!selection) return undefined;

  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(true);

  const rect = range.getClientRects()[0];

  if (!rect) return undefined;

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

export default getCaretCoordinates;
