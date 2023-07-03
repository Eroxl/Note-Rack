import PageDataInterface from '../types/pageTypes.d';
import { focusBlockAtIndexRelativeToBottom } from '../helpers/focusHelpers';
import { getCursorOffset } from '../helpers/caretHelpers';

const handleKeyUp = (
  e: React.KeyboardEvent<HTMLSpanElement>,
  index: number,
  pageData: PageDataInterface['message'],
  element: HTMLSpanElement,
) => {
  e.preventDefault();

  const offset = getCursorOffset(element);

  focusBlockAtIndexRelativeToBottom(
    index,
    pageData,
    offset,
  );
};

export default handleKeyUp;
