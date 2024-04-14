import React, { useEffect } from 'react';
import type { EditorProps } from '@note-rack/editor/components/Editor';
import { SelectionManager, useSelectable } from 'react-virtual-selection';

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

    useEffect(() => {
      document.getSelection()?.removeAllRanges();
    }, [isSelected]);

    return (
      <div
        style={isSelected ? selectedStyle : undefined}
        className={isSelected ? selectedClassName : undefined}

        onMouseDown={(e) => {
          e.stopPropagation();
        }}

        onFocus={() => {
          SelectionManager.Instance.highlightSelected({
            top: Infinity, bottom: Infinity, left: Infinity, right: Infinity,
          }, 'selectableBlock');
        }}

        draggable={false}
        ref={selectableElement as React.LegacyRef<HTMLDivElement>}
      >
        {children}
      </div>
    );
  }
}

export default createWrapper;
