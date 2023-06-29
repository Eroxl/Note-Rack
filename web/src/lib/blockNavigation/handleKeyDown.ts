import { focusBlockAtIndexRelativeToTop, getLengthExcludingLastLine } from '../helpers/focusHelpers';
import type PageDataInterface from '../types/pageTypes.d';
import { getCursorOffset } from '../helpers/caretHelpers';

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLSpanElement>,
  index: number,
  pageData: PageDataInterface['message'],
  element: HTMLSpanElement,
) => {
  e.preventDefault();

  let lengthExcludingLastLine = getLengthExcludingLastLine(e.currentTarget);

  if (lengthExcludingLastLine !== 0) {
    lengthExcludingLastLine += 1;
  }

  const offset = getCursorOffset(element);

  const distanceFromBottom = (
    offset - lengthExcludingLastLine
  );

  focusBlockAtIndexRelativeToTop(
    index,
    pageData,
    distanceFromBottom,
  );
};

export default handleKeyDown;
