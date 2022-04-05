/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const [_dragData, drag, preview] = useDrag(() => ({
    type: 'draggableBlock',
    item: () => ({ blockID, index }),
  }), [index]);

  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: (item) => {
      const { index: itemIndex } = item as { index: number };
      const pageDataCopy = { ...pageData };

      // FIXME: There's some issues with this when dragging up vs dragging down (dragging up works)
      pageDataCopy.message.data.splice(index + 1, 0, pageData.message.data[itemIndex]);
      pageDataCopy.message.data.splice(itemIndex + 1, 1);
      setPageData(pageDataCopy);
    },
  }), [index]);

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
          <div className="absolute w-full h-0.5 bg-blue-400 -bottom-2 print:hidden" />
        )
      }
    </div>
  );
};

export default BaseBlock;
