/**
 * Get the length of the first line of a contenteditable element
 * @param element The element to get the length of the first line from
 * @returns The length of the first line of the element
 */
const getFirstLineLength = (element: HTMLElement) => {
  if (!element.textContent) return 0;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  let length = 0;

  let node;

  while (true) {
    node = walker.nextNode();

    if (!node) break;

    if (!node.textContent) continue;

    const range = document.createRange();

    range.selectNodeContents(node);

    // ~ If the node only spans one line, add its length to the total length
    if (range.getClientRects().length <= 1) {
      length += node.textContent.length || 0;

      continue;
    }

    range.setEnd(node, node.textContent.length - 1);

    // ~ If the node spans multiple lines, find the length of the last line
    for (let i = node.textContent.length; i >= 0; i -= 1) {
      range.setStart(node, i);

      if (range.getClientRects().length <= 1) continue;

      length += i;

      break;
    }
  }

  return length;
};

export default getFirstLineLength;
