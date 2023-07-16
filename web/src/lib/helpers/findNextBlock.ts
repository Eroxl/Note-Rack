import type PageDataInterface from "../types/pageTypes";

/**
 * Get the closest block to the element
 * @param element The element to start the search from
 * @returns The closest block to the element or null if none found
 */
export const getClosestBlock = (
  element: HTMLElement | null
): (HTMLElement & { dataset: { blockIndex: string } }) | null => {
  if (!element) return null;

  if (element.dataset.blockIndex) {
    return element as (HTMLElement & { dataset: { blockIndex: string } });
  }

  return getClosestBlock(element.parentElement);
};

/**
 * Find the next block in the editor
 * @param element The element to start the search from
 * @param iterator The iterator function to use to find the next block
 * @param pageData The page data to use to find the next block
 * @param editor The editor to search in
 * @returns The next block or undefined if none found
 */
const findNextBlock = (
  element: HTMLElement | null,
  iterator: (start: number) => number,
  pageData: PageDataInterface['message'],
  editor: HTMLElement = document.querySelector('.editor') as HTMLElement
): HTMLElement | undefined => {
  if (!element || !pageData) return;

  const block = getClosestBlock(element);

  if (!block) return;

  const blockIndex = parseInt(block.dataset.blockIndex);

  const nextBlockID = pageData.data[iterator(blockIndex)]?._id;

  const nextBlock = editor.querySelector(`#block-${nextBlockID}`) as HTMLElement;

  if (!nextBlock) return;

  if (!nextBlock.dataset.blockIndex) return findNextBlock(nextBlock, iterator, pageData, editor);

  return nextBlock;
}

export default findNextBlock;
