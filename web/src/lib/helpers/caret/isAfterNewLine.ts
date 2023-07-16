import getLastLineLength from "../getLastLineLength";

/**
 * Check if the caret is after a new line
 * @param range The range to check
 * @returns Whether the caret is after a new line
 */
const isAfterNewLine = (range: Range) => {
  const rangeContainer = (
    range.startContainer.parentElement
    || range.startContainer as HTMLElement
  );

  if (
    !range.startContainer
    || !rangeContainer.textContent
    || range.startOffset === 0
  ) return false;

  const lengthExcludingLastLine = rangeContainer.textContent.length - getLastLineLength(rangeContainer);

  if (lengthExcludingLastLine === 0) return false;

  return lengthExcludingLastLine + 1 === range.startOffset;
};

export default isAfterNewLine;
