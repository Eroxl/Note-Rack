import type BlockState from '../../types/BlockState';
import focusElement from '../../helpers/focusElement';

const focusAddedBlock = (_: BlockState[], block: BlockState) => {
  // ~ Focus the new block
  setTimeout(() => {
    const newBlock = document.getElementById(`block-${block.id}`)?.firstChild as (HTMLElement | undefined);

    if (!newBlock) return;

    newBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });

    focusElement(newBlock);
  }, 0);
}

export default focusAddedBlock;
