/* eslint-disable react/no-children-prop */
import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BlockHandle from './BlockHandle';
import BlockTypes from '../../constants/BlockTypes';
import type { BaseBlockProps } from '../../types/blockTypes';

const BaseBlock = (props: BaseBlockProps) => {
  const {
    page,
    index,
    blockID,
    pageData,
    children,
    blockType,
    properties,
    setPageData,
    isMenuOpen,
    setIsMenuOpen,
  } = props;

  const blockRef = useRef<HTMLDivElement>(null);

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  const [, drag, preview] = useDrag(() => ({
    type: 'draggableBlock',
    item: () => ({
      blockID,
      index,
      blockType,
      properties,
    }),
  }), [index]);

  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: (item) => {
      const {
        index: itemIndex,
        blockID: itemBlockID,
        blockType: itemBlockType,
        properties: itemProperties,
      } = item as {
        index: number,
        blockID: string,
        blockType: string,
        properties: Record<string, unknown>
      };

      const pageDataCopy = { ...pageData };

      const offset = itemIndex > index ? 1 : 0;

      pageDataCopy.message.data.splice(index + 1, 0, pageData.message.data[itemIndex]);
      pageDataCopy.message.data.splice(itemIndex + offset, 1);
      setPageData(pageDataCopy);

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/page/move/${page}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            'doc-ids': [],
            'current-block-id': itemBlockID,
            'current-index': itemIndex,
            'new-index': index,
            'current-block-type': itemBlockType,
            'current-block-properties': itemProperties,
          }),
        },
      );
    },
  }), [index]);

  preview(drop(blockRef));

  return (
    <div ref={blockRef} className="relative flex group" key={blockID}>
      <BlockHandle
        draggableRef={drag}
        isGlobalMenuOpen={isMenuOpen}
        setIsGlobalMenuOpen={setIsMenuOpen}
      />
      {
        React.createElement(
          BlockTypes[currentBlockType] ?? BlockTypes.text,
          {
            page,
            index,
            blockID,
            pageData,
            setPageData,
            setCurrentBlockType,
            type: currentBlockType,
            children: children ?? [],
            properties: properties ?? {},
          },
        )
      }
      {
        hovered && (
          <div className="absolute w-full h-0.5 bg-blue-400 -bottom-2 print:hidden" />
        )
      }
    </div>
  );
};

export default BaseBlock;
