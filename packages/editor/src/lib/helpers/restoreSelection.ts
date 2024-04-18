import type SelectionState from "../../types/SelectionState";
import getBlockById from "./getBlockByID";
import { checkTreeForContentEditable, getFirstTextNode } from "./focusElement";

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

  let lastSelectableElement: HTMLElement | undefined;

  while (iterator.nextNode()) {
    const node = iterator.referenceNode;

    if ((node as HTMLElement).isContentEditable) {
      lastSelectableElement = node as HTMLElement;
    }

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

      if (checkTreeForContentEditable(getFirstTextNode(node as HTMLElement) as HTMLElement)) {
        range.setStart(node, index);
      } else if (lastSelectableElement) {
        range.setStart(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
      }
    }

    if (offset >= selectionState.offset + selectionState.length - 1 && range.endContainer === range.startContainer) {
      const index = Math.max(
        Math.min(
          selectionState.offset + selectionState.length - (offset - length),
          length
        ),
        0
      )

      if (checkTreeForContentEditable(getFirstTextNode(node as HTMLElement) as HTMLElement)) {
        range.setEnd(node, index);
      } else if(lastSelectableElement) {
        range.setEnd(lastSelectableElement, lastSelectableElement.textContent?.length || 0);
      }

      break;
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);

  selectionBlock.style.caretColor = 'auto';
}

export default restoreSelection;
