import type SelectionState from "../../types/SelectionState";
import getBlockById from "./getBlockByID";
import focusElement from "./focusElement";

const restoreSelection = (selectionState: SelectionState) => {
  const { blockId } = selectionState;

  const selectionBlock = getBlockById(blockId);

  if (!selectionBlock) return;

  focusElement(
    selectionBlock,
    selectionState.offset,
    selectionState.length
  )
}

export default restoreSelection;
