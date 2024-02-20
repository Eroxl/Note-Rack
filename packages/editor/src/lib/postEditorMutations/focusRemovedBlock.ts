import type BlockState from '../../types/BlockState';
import focusElement from '../helpers/focusElement';
import getBlockById from '../helpers/getBlockByID';

const focusRemovedBlock = (state: BlockState[], id: string) => {
  const previousBlockIndex = Math.max(state.findIndex(block => block.id === id) - 1, 0);
  const previousBlockId = state[previousBlockIndex]?.id

  // ~ Focus the next block
  setTimeout(() => {
    if (!previousBlockId) return;

    const nextBlock = getBlockById(previousBlockId);

    if (!nextBlock) return;

    nextBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });

    focusElement(nextBlock, (nextBlock.textContent?.length || 1) - 1);
  }, 25);
}

export default focusRemovedBlock;
