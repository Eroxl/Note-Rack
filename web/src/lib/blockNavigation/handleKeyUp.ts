import PageDataInterface from '../types/pageTypes.d';
import { focusBlockAtIndexRelativeToBottom } from '../helpers/focusHelpers';

const handleKeyUp = (
  e: React.KeyboardEvent<HTMLSpanElement>,
  index: number,
  pageData: PageDataInterface['message'],
) => {
  e.preventDefault();

  // ~ Get the offset of the current range
  const offset = window.getSelection()?.getRangeAt(0).startOffset || 0;

  focusBlockAtIndexRelativeToBottom(
    index,
    pageData,
    offset,
  );
};

export default handleKeyUp;
