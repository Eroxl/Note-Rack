import React from "react";

import type InlineBlockRenderer from "../types/InlineBlockRenderer";

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
    <span
      data-type={type[0]}
    >
      <CurrentRenderer>
        {renderInlineBlock(text, type.slice(1), renderers)}
      </CurrentRenderer>
    </span>
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

  if (start >= text.length) {
    if (text.length === 0) {
      return ['\n'];
    }

    return result;
  }

  const trailingText = text
    .substring(start)

  result.push(
    trailingText.endsWith('\n')
      ? trailingText
      : trailingText + '\n'
  );

  return result;
};

export default renderInlineBlocks;
