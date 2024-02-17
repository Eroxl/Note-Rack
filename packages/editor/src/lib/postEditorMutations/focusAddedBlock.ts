import type BlockState from '../../types/BlockState';
import EditorState from '../../types/EditorState';
import focusElement from '../helpers/focusElement';
import getBlockById from '../helpers/getBlockByID';

const focusAddedBlock = (_: EditorState, block: BlockState) => {
  // ~ Focus the new block
  setTimeout(() => {
    const newBlock = getBlockById(block.id);
    
    if (!newBlock) return;

    newBlock.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });

    focusElement(newBlock);
  }, 25);
}

export default focusAddedBlock;
