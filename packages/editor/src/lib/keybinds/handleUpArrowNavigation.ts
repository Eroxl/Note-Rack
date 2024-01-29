import KeybindHandler from "../../types/KeybindHandler";
import SelectionState from "../../types/SelectionState";
import getBlockById from "../helpers/getBlockByID";
import getFirstLineLength from "../helpers/getFirstLineLength";
import getLastLineLength from "../helpers/getLastLineLength";
import restoreSelection from "../helpers/restoreSelection";

const handleUpArrowNavigation: KeybindHandler['handler'] = (_, state, currentSelection, event) => {
  if (!currentSelection) return;

  const selectionElement = getBlockById(currentSelection.blockId);

  if (!selectionElement) return;

  const firstLineLength = getFirstLineLength(selectionElement);

  const isOnFirstLine = currentSelection.offset <= firstLineLength;

  if (!isOnFirstLine) return;
  
  const currentBlockIndex = state.findIndex(({ id }) => id === currentSelection.blockId);

  const nextBlock = state[currentBlockIndex - 1];

  if (!nextBlock) return;

  const previousBlockElement = getBlockById(nextBlock.id);

  if (!previousBlockElement) return;

  event.preventDefault();
  event.stopPropagation();

  const nextBlockSelection: SelectionState = {
    blockId: nextBlock.id,
    offset: Math.min(
      getLastLineLength(previousBlockElement),
      currentSelection.offset
    ),
    length: 0,
  }

  restoreSelection(nextBlockSelection);
}

export default handleUpArrowNavigation;
