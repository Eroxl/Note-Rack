import React from "react";

import InlineBlockSchema from "../types/InlineBlockSchema";

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
  inlineBlockSchema?: {
    [type: string]: InlineBlockSchema
  },
  index: number = 0,
) => {
  if (!type[0]) return text;

  const schema = inlineBlockSchema?.[type[0]];
  
  if (!schema) return text;

  const {
    renderer: CurrentRenderer,
    acceptsChildren
  } = schema;

  return (
    <span
      data-type={type[0]}
      key={index}
    >
      <CurrentRenderer>
        {
          acceptsChildren 
            ? renderInlineBlock(text, type.slice(1), inlineBlockSchema)
            : text
        }
      </CurrentRenderer>
    </span>
  )
}

const renderInlineBlocks = (
  text: string,
  inlineBlocks?: InlineBlock[],
  inlineBlocksSchema?: {
    [type: string]: InlineBlockSchema
  },
) => {
  let result: React.ReactNode[] = [];
  let start = 0;

  sortInlineBlocks(inlineBlocks || []).forEach((block, index) => {
    const { type, start: blockStart, end: blockEnd } = block;

    const preBlockText = text.slice(start, blockStart);

    const blockText = text.slice(blockStart, blockEnd);

    if (preBlockText) {
      result.push(preBlockText);
    }

    result.push(
      renderInlineBlock(blockText, type, inlineBlocksSchema, index)
    )

    start = blockEnd;
  });

  if (start >= text.length) {
    if (text.length === 0) {
      return ['\uFEFF'];
    }

    return result;
  }

  const trailingText = text
    .substring(start)

  result.push(
    trailingText.endsWith('\uFEFF')
      ? trailingText
      : trailingText + '\uFEFF'
  );

  return result;
};

export default renderInlineBlocks;
