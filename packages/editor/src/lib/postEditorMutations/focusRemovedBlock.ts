import type BlockState from '../../types/BlockState';
import focusElement from '../../helpers/focusElement';

const focusRemovedBlock = (state: BlockState[], id: string) => {
  const blockIndex = Math.max(state.findIndex(block => block.id === id) - 1, 0);

  // ~ Focus the next block
  setTimeout(() => {
    const nextBlock = document.getElementById(`block-${state[blockIndex]?.id}`)?.firstChild as (HTMLElement | undefined);

    if (!nextBlock) return;

    nextBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });

    focusElement(nextBlock, nextBlock.textContent?.length || 0);
  }, 0);
}

export default focusRemovedBlock;
