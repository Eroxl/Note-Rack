import React from "react";

import type InlineBlockRenderer from "../../../types/InlineBlockRenderer";
import { InBlockMutations } from "../../../types/BlockRenderer";

export type InlineBlock = {
  type: string[],
  start: number,
  end: number,
  properties?: Record<string, unknown>[],
};

const sortInlineBlocks = (inlineBlocks: InlineBlock[]) => {
  return inlineBlocks.sort((a, b) => a.start - b.start);
}

const renderInlineBlock = (
  text: string,
  properties: Record<string, unknown>[],
  type: string[],
  mutations: InBlockMutations,
  inlineBlockInfo: {
    blockID: string,
    blockStart: number,
    blockEnd: number,
  },
  renderers?: {
    [type: string]: InlineBlockRenderer<Record<string, unknown>>
  },
  index: number = 0,
) => {
  if (!type[0]) return text;

  const Rendererer = renderers?.[type[0]];
  
  if (!Rendererer) return text;

  return (
    <span
      data-type={type[0]}
      data-properties={JSON.stringify(properties[0])}
      key={index}
    >
      <Rendererer
        properties={{
          ...properties[0],
          ...inlineBlockInfo
        }}
        mutations={mutations}
      >
        {
          renderInlineBlock(
            text,
            properties.slice(1),
            type.slice(1),
            mutations,
            inlineBlockInfo,
            renderers
          )
        }
      </Rendererer>
    </span>
  )
}

const renderInlineBlocks = (
  text: string,
  mutations: InBlockMutations,
  blockID: string,
  inlineBlocks?: InlineBlock[],
  rendererers?: {
    [type: string]: InlineBlockRenderer<Record<string, any>>
  },
) => {
  let result: React.ReactNode[] = [];
  let start = 0;

  sortInlineBlocks(inlineBlocks || []).forEach((block, index) => {
    const { 
      type,
      properties,
      start: blockStart,
      end: blockEnd
    } = block;

    const preBlockText = text.slice(start, blockStart);

    const blockText = text.slice(blockStart, blockEnd);

    if (preBlockText) {
      result.push(preBlockText);
    }

    result.push(
      renderInlineBlock(blockText, properties || [], type, mutations, {
        blockID,
        blockStart,
        blockEnd,
      }, rendererers, index)
    )

    start = blockEnd;
  });

  if (start >= text.length) {
    if (text.length === 0) {
      return ['\uFEFF'];
    }

    result.push(
      <span>
        {'\uFEFF'}
      </span>
    )

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
