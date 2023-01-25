/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSelectable, SelectionManager } from 'react-virtual-selection';

import { moveBlock } from '../../lib/pages/updatePage';
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

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  // -=- Setup Selection -=-
  const [selected, selectableRef] = useSelectable(
    'blocks',
    () => ({
      blockID,
      index,
      isBlockPage: currentBlockType === 'page',
    }),
  );

  // -=- Setup Drag and Drop -=-
  const [, drag, preview] = useDrag(() => ({
    type: 'draggableBlock',
    item: () => ({
      blockID,
      index,
    }),
  }), [index]);

  // =- Setup Drop -=-
  const [{ hovered }, drop] = useDrop(() => ({
    accept: 'draggableBlock',
    collect: (monitor) => ({
      hovered: monitor.isOver() && (monitor.getItem() as { index: number }).index !== index,
    }),
    drop: async (item) => {
      const {
        index: itemIndex,
        blockID: itemBlockID,
      } = item as {
        index: number,
        blockID: string,
      };

      // -=- Move Block -=-
      await moveBlock(
        [itemBlockID],
        itemIndex,
        index,
        page,
        pageData,
        setPageData,
      );
    },
  }), [index]);

  preview(drop(selectableRef as React.RefObject<HTMLDivElement>));

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={selectableRef as React.RefObject<HTMLDivElement>}
      className={`relative flex group ${selected && 'bg-sky-300/20'}`}
      key={blockID}
      onMouseDown={(e) => { e.stopPropagation(); }}
      onFocus={() => {
        SelectionManager.Instance.highlightSelected({
          top: Infinity, bottom: Infinity, left: Infinity, right: Infinity,
        }, 'blocks');
      }}
    >
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
