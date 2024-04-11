import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import type { EditorProps } from '@note-rack/editor/components/Editor';
import type BlockState from '@note-rack/editor/types/BlockState';

import createHandle from './createHandle';

type Wrapper = Required<EditorProps>['blockWrappers'][number]

type DragableItem = {
  block: BlockState,
}

const createWrapper = (
  HandleComponent: ReturnType<typeof createHandle>,
  style?: React.CSSProperties,
  className?: string,
  hoveredStyle?: React.CSSProperties,
  hoveredClass?: string,
): Wrapper => {
  return ({ children, block, mutations }) => {
    const [, drag, preview] = useDrag<DragableItem>(() => ({
      type: 'draggableBlock',
      item: () => ({
        block: block,
      }),
    }), [block.id]);

    const [{ hovered }, drop] = useDrop<
      DragableItem,
      unknown,
      { hovered: boolean }
    >(() => ({
      accept: 'draggableBlock',
      collect: (monitor) => ({
        hovered: monitor.isOver() && monitor.getItem().block.id !== block.id
      }),
      drop: async (item) => {
        mutations.moveBlock(item.block.id, block.id);
      },
    }), [block.id]);

    return (
      <div
        style={{ position: 'relative' }}
        ref={drop}
      >
        <HandleComponent
          innerRef={drag}
        />
        <div
          style={{
            ...style,
            ...(hovered && hoveredStyle),
          }}
          className={`${className} ${hovered && hoveredClass}`}
          ref={preview}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default createWrapper;
