/**
 * Find the text nodes that contain a given range
 * @param element The element to search in
 * @param range The range to search for
 * @returns An object containing the nodes and the start offset of the nodes
 */
const findNodesInRange = (
  element: HTMLElement,
  range: {
    start: number;
    end: number;
  }
): {
  nodes: Node[];
  startOffset: number;
} => {
  let startOffset = 0;
  let endOffset = 0;
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  let blocksContainingRegex: Node[] = [];

  // ~ Find the text nodes that contains the regex
  while (treeWalker.nextNode()) {
    const length = treeWalker.currentNode.textContent?.length || 0;

    endOffset += length;
      
    if (endOffset >= range.start) {
      blocksContainingRegex.push(treeWalker.currentNode)

      // ~ All of the text nodes the regex could be in have been found
      if (endOffset > range.end) break;

      continue;
    }

    startOffset += length;
  }

  return {
    nodes: blocksContainingRegex,
    startOffset,
  }
};

export default findNodesInRange;
