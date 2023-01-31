import type PageDataInterface from '../types/pageTypes';

const focusBlockAtIndex = async (
  index: number,
  pageData: PageDataInterface,
) => {
  /**
   * Select the end of the element
   * @param element The element to focus
   */
  const selectEnd = (element: HTMLElement) => {
    element.focus();
    // ~ Move the cursor to the end of the block unless the only text is a newline
    if (element.textContent === '\n') return;

    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(element, element.childNodes.length);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  // ~ Find the previous editable block
  while (index > 0) {
    index -= 1;

    const block = document.getElementById(pageData.message.data[index]._id);
    if (block?.getAttribute('contenteditable') === 'true') {
      selectEnd(block);
      return;
    }
  }

  // ~ If there is no previous editable block, focus the first editable block
  const block = document.getElementById('page-title')?.firstChild;
  if (!block) return;

  selectEnd(block as HTMLElement);
};

export default focusBlockAtIndex;
