import React from 'react';
import type { EditorProps } from '@note-rack/editor/components/Editor';
import type BlockState from '@note-rack/editor/types/BlockState';
import { useSelectable } from 'react-virtual-selection';

type Wrapper = Required<EditorProps>['blockWrappers'][number]

const createWrapper = (
  selectedStyle?: React.CSSProperties,
  selectedClassName?: string,
): Wrapper => {
  return ({ children, block }) => {
    const [isSelected, selectableElement] = useSelectable(
      'selectableBlock',
      () => block,
      [block],
    )

    return (
      <div
        style={isSelected ? selectedStyle : undefined}
        className={isSelected ? selectedClassName : undefined}

        draggable={false}
        ref={selectableElement as React.LegacyRef<HTMLDivElement>}
      >
        {children}
      </div>
    );
  }
}

export default createWrapper;
