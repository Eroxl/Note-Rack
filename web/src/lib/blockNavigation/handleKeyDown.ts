import { focusBlockAtIndexRelativeToTop, getLengthExcludingLastLine } from '../helpers/focusHelpers';
import type PageDataInterface from '../types/pageTypes';

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLSpanElement>,
  index: number,
  pageData: PageDataInterface['message'],
) => {
  e.preventDefault();

  const range = window.getSelection()?.getRangeAt(0);

  if (!range) return;

  const fullText = e.currentTarget.innerText || '';
  const rangeElementText = range.startContainer.textContent || '';

  let offset = fullText.length - rangeElementText.length + range.startOffset;

  if (range.endContainer !== e.currentTarget.lastElementChild) {
    let foundLastElement = false;
    Array.from(e.currentTarget.childNodes).reverse().forEach((node) => {
      foundLastElement = foundLastElement
        ? true
        : node === range.endContainer;

      if (foundLastElement) return;

      offset -= node.textContent?.length || 1;
    });
  }

  let lengthExcludingLastLine = getLengthExcludingLastLine(e.currentTarget);

  if (lengthExcludingLastLine !== 0) {
    lengthExcludingLastLine += 1;
  }

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
