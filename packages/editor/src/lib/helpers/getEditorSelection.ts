import type SelectionState from "../../types/SelectionState";
import getCursorOffset from "./caret/getCursorOffset";

const getBlockElementFromChild = (
  child: Node,
  editorElement: HTMLElement
): HTMLElement | void => {
  const parent = child.parentElement;

  if (!parent || parent === document.body) return;

  if (parent === editorElement) return child as HTMLElement;

  return getBlockElementFromChild(parent, editorElement);
}

const getEditorSelection = (editorElement: HTMLElement): SelectionState | undefined => {
  const activeElement = document.activeElement;

  if (!activeElement) return;

  const container = getBlockElementFromChild(activeElement, editorElement);

  if (!container) return;

  const endingSelectionIndex = getCursorOffset(container);
  const selectionLength = window.getSelection()?.toString().length || 0;

  return {
    blockId: container.id.replace('block-', ''),
    offset: endingSelectionIndex - selectionLength,
    length: selectionLength
  };
};

export default getEditorSelection;
