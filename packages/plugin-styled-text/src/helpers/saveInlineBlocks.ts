import type { Interval } from '@note-rack/editor/lib/helpers/mergeIntervals';

/**
 * Walk up the tree to get the full text style of the node
 * @param node The node to get the full text style of
 * @param topNode The top node to stop at
 * @returns The full text style of the node
 */
const getFullTextStyle = (node: Node, topNode: HTMLElement) => {
  let currentNode = node;
  let style: string[] = [];

  while (currentNode.parentElement && currentNode.parentElement !== topNode) {
    currentNode = currentNode.parentElement;

    const type = (currentNode as HTMLElement).getAttribute('data-type');

    if (!type) continue;

    style.push(type);
  }

  return style;
};

const saveInlineBlocks = (
  element: HTMLElement
): (Interval & { type: string[] })[] => {
  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  const style: (Interval & { type: string[] })[] = [];
  let length = 0;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (!node.textContent) continue;

    length += node.textContent.length;

    const type = getFullTextStyle(node, element);

    if (!type.length) continue;

    style.push({
      type,
      start: length - node.textContent.length,
      end: length,
    });
  }

  return style;
};

export default saveInlineBlocks;
