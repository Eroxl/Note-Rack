const renderNewInlineBlocks = (
  blocks: Node[],
  style: string,
  blockType: string,
  startOffset: number,
  inlineBlock: {
    start: number;
    end: number;
    bindLength: number;
  },
  parentElement: HTMLElement,
) => {
  let currentOffset = startOffset;

  // ~ Render the inline block
  blocks.forEach((node) => {
    if (!node.parentElement || !node.textContent) return;

    currentOffset += node.textContent.length;

    let parentElement = node.parentElement;

    // ~ If the node is entirely contained in the regex
    if (
      currentOffset - node.textContent.length >= (inlineBlock.start + inlineBlock.bindLength)
      && currentOffset <= (inlineBlock.end - inlineBlock.bindLength)
    ) {
      // ~ Walk up the tree until we find the node who's parent is
      //   the `editableRef` and add the bind type to it
      let topElement = node.parentElement;

      while (topElement.parentElement !== parentElement && topElement !== parentElement) {
        if (!topElement.parentElement) break;

        topElement = topElement.parentElement;
      }
      
      const currentStyle = topElement.getAttribute('data-inline-type')
      
      // ~ If the node doesn't have a style assume it's a text node
      //   and create a new span to contain the inline block
      if (!currentStyle || topElement === parentElement) {
        const newSpan = document.createElement('span');
        newSpan.setAttribute('data-inline-type', JSON.stringify([blockType]));
        newSpan.classList.add(style);
        newSpan.textContent = node.textContent;

        // ~ If the node is the editableRef, remove only the node
        //   and append the new span. Otherwise, replace the node
        //   with the new span
        if (topElement === parentElement) {
          topElement.replaceChild(newSpan, node);
          return;
        }

        topElement.replaceWith(newSpan);
        return;
      }

      // ~ If the node already has a style, add the new style to it
      const newStyle = JSON.parse(currentStyle);

      // ~ Just in case the style is not an array for some reason
      if (!Array.isArray(newStyle)) return;

      newStyle.push(blockType);
      topElement.classList.add(style);
      topElement.setAttribute('data-inline-type', JSON.stringify(newStyle));

      return;
    }

    // ~ If the node is not entirely contained in the regex
    //   we need to split the node into 2-3 parts

    // ~ Create a new text node to contain the text after the regex
    const nonRegexText = node.textContent.substring(
      inlineBlock.end - currentOffset + node.textContent.length,
    );

    const nonRegexTextNode = document.createTextNode(nonRegexText);
    
    parentElement.insertBefore(nonRegexTextNode, node.nextSibling);

    // ~ Create a new span to contain the inline block
    const newSpan = document.createElement('span');
    newSpan.classList.add(style);

    const startingPosition = inlineBlock.start - (currentOffset - node.textContent.length);

    const endingPosition = Math.min(
      startingPosition + (inlineBlock.end - inlineBlock.start) - inlineBlock.bindLength,
      node.textContent.length,
    )

    newSpan.textContent = node.textContent.substring(
      startingPosition + inlineBlock.bindLength,
      endingPosition,
    )

    newSpan.setAttribute('data-inline-type', JSON.stringify([blockType]));
    parentElement.insertBefore(newSpan, node.nextSibling);

    // ~ If there is non regex text before the regex
    if (inlineBlock.start > currentOffset - node.textContent.length) {
      const nonRegexTextLength = inlineBlock.start - (currentOffset - node.textContent.length);
      
      const nonRegexText = node.textContent.substring(0, nonRegexTextLength);

      const nonRegexTextNode = document.createTextNode(nonRegexText);
      
      parentElement.insertBefore(nonRegexTextNode, node.nextSibling);
    }

    // ~ If the node still has text, remove it
    node?.parentElement?.removeChild(node);
  });
}

export default renderNewInlineBlocks;
