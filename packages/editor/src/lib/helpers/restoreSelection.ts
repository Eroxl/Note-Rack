import type SelectionState from "src/types/SelectionState";
import getBlockById from "./getBlockByID";

const restoreSelection = (selectionState: SelectionState) => {
  const { blockId } = selectionState;

  const selectionBlock = getBlockById(blockId);

  if (!selectionBlock) return;

  const range = document.createRange();
  const selection = window.getSelection();

  if (!selection) return;

  const iterator = document.createNodeIterator(
    selectionBlock,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (childNode) => {
        if (childNode.nodeName === 'BR') return NodeFilter.FILTER_ACCEPT;
        if (childNode.nodeName === '#text') return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    },
  );

  let offset = 0;

  while (iterator.nextNode()) {
    const node = iterator.referenceNode;

    const length = node.nodeName === '#text'
      ? node.textContent?.length || 0
      : 1;

    offset += length;

    if (offset >= selectionState.offset && range.startContainer === document) {
      const index = Math.max(
        Math.min(
          selectionState.offset - (offset - length),
          length
        ),
        0
      )

      range.setStart(node, index);
    }

    if (offset >= selectionState.offset + selectionState.length && range.endContainer === range.startContainer) {
      const index = Math.max(
        Math.min(
          selectionState.offset + selectionState.length - (offset - length),
          length
        ),
        0
      )

      range.setEnd(node, index);
      break;
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);

  selectionBlock.style.caretColor = 'auto';
}

export default restoreSelection;
