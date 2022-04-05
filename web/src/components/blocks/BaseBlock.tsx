/* eslint-disable react/no-children-prop */
import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BlockHandle from '../BlockHandle';
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
  } = props;

  const blockRef = useRef<HTMLDivElement>(null);

  const [currentBlockType, setCurrentBlockType] = useState(blockType);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_dragData, drag, preview] = useDrag(() => ({
    type: 'draggableBlock',
    item: () => ({ blockID, index }),
  }));

  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: (item) => {
      // TODO: Add dropping functionality
    },
  }));

  preview(drop(blockRef));

  return (
    <div ref={blockRef} className="relative flex group" key={blockID}>
      <BlockHandle draggableRef={drag} />
      {
        React.createElement(
          BlockTypes[currentBlockType] ?? 'fragement',
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
          <div className="absolute w-full h-1 bg-blue-200 -bottom-2" />
        )
      }
    </div>
  );
};

export default BaseBlock;
