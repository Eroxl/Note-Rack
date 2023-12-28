import React from "react";

import type InlineBlockRenderer from "src/types/InlineBlockRenderer";

type InlineBlock = {
  type: string[],
  start: number,
  end: number,
};

const sortInlineBlocks = (inlineBlocks: InlineBlock[]) => {
  return inlineBlocks.sort((a, b) => a.start - b.start);
}

const renderInlineBlock = (
  text: string,
  type: string[],
  renderers?: {
    [type: string]: InlineBlockRenderer
  },
) => {
  if (!type[0]) return text;

  const CurrentRenderer = renderers?.[type[0]];
  
  if (!CurrentRenderer) return text;

  return (
    <CurrentRenderer>
      {renderInlineBlock(text, type.slice(1), renderers)}
    </CurrentRenderer>
  )
}

const renderInlineBlocks = (
  text: string,
  inlineBlocks?: InlineBlock[],
  renderers?: {
    [type: string]: InlineBlockRenderer
  },
) => {
  let result: React.ReactNode[] = [];
  let start = 0;


  sortInlineBlocks(inlineBlocks || []).forEach((block) => {
    const { type, start: blockStart, end: blockEnd } = block;

    const preBlockText = text.slice(start, blockStart);

    const blockText = text.slice(blockStart, blockEnd);

    if (preBlockText) {
      result.push(preBlockText);
    }

    result.push(
      renderInlineBlock(blockText, type, renderers)
    )

    start = blockEnd;
  });

  if (start >= text.length) return result;

  const trailingText = text
    .substring(start)

  result.push(trailingText);

  return result;
};

export default renderInlineBlocks;