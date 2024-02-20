import KeybindHandler from "../../types/KeybindHandler";
import SelectionState from "../../types/SelectionState";
import getBlockById from "../helpers/getBlockByID";
import getFirstLineLength from "../helpers/getFirstLineLength";
import getLastLineLength from "../helpers/getLastLineLength";
import restoreSelection from "../helpers/restoreSelection";

const handleDownArrowNavigation: KeybindHandler['handler'] = (_, state, currentSelection, event) => {
  if (!currentSelection) return;

  const selectionElement = getBlockById(currentSelection.blockId);

  if (!selectionElement) return;

  const lastLineLength = getLastLineLength(selectionElement);

  const isOnLastLine = currentSelection.offset >= (selectionElement.textContent?.length || 0) - lastLineLength;

  if (!isOnLastLine) return;
  
  const currentBlockIndex = state.findIndex(({ id }) => id === currentSelection.blockId);

  const nextBlock = state[currentBlockIndex + 1];

  if (!nextBlock) return;
  
  const nextBlockElement = getBlockById(nextBlock.id);

  if (!nextBlockElement) return;

  event.preventDefault();
  event.stopPropagation();

  const nextBlockSelection: SelectionState = {
    blockId: nextBlock.id,
    offset: Math.min(
      getFirstLineLength(nextBlockElement),
      currentSelection.offset - (selectionElement.textContent?.length || 0) + lastLineLength
    ),
    length: 0,
  }

  restoreSelection(nextBlockSelection);
}

export default handleDownArrowNavigation;
