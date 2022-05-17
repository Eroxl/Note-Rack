/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState } from 'react';

import SelectionManger from '../classes/SelectionManager';

interface SelectableProps {
  accepts: string;
  children: React.ReactNode[] | React.ReactNode;
  selectionStyle?: React.CSSProperties;
  selectionClassName?: string;
}

const Selectable: React.FC<SelectableProps> = (props) => {
  const {
    children,
    accepts,
    selectionClassName,
    selectionStyle,
  } = props;

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState({
    startY: 0,
    endY: 0,
    startX: 0,
    endX: 0,
  });

  const selectableRef = useRef<HTMLDivElement>(null);

  const selectionManager = SelectionManger.Instance;

  return (
    <div
      ref={selectableRef}
      onMouseMove={(e) => {
        if (!isSelecting || !accepts) return;

        const { clientX, clientY } = e;

        setSelectionArea({
          ...selectionArea,
          endY: clientY,
          endX: clientX,
        });

        selectionManager.highlightSelected(
          {
            top: Math.min(selectionArea.startY, clientY),
            left: Math.min(selectionArea.startX, clientX),
            bottom: Math.max(selectionArea.startY, clientY),
            right: Math.max(selectionArea.startX, clientX),
          },
          accepts,
        );
      }}
      onMouseDown={(e) => {
        setIsSelecting(true);

        const { clientX, clientY } = e;

        setSelectionArea({
          startY: clientY,
          endY: clientY,
          startX: clientX,
          endX: clientX,
        });

        selectionManager.highlightSelected(
          {
            top: clientY,
            left: clientX,
            bottom: clientY,
            right: clientX,
          },
          accepts,
        );
      }}
      onMouseUp={() => {
        setIsSelecting(false);

        const selectedElements = selectionManager.getSelected({
          top: Math.min(selectionArea.startY, selectionArea.endY),
          left: Math.min(selectionArea.startX, selectionArea.endX),
          bottom: Math.max(selectionArea.startY, selectionArea.endY),
          right: Math.max(selectionArea.startX, selectionArea.endX),
        }, accepts).filter(({ isSelected }) => isSelected).map((el) => el.selectableItem.item);

        const selectedItemsData = selectedElements.map((el) => el());

        selectionManager.selectableWatchers[accepts].forEach((watcher) => {
          watcher(selectedItemsData);
        });
      }}
      draggable={false}
    >
      {children}
      {
        isSelecting && (
          <div
            draggable={false}
            className={`absolute bg-white bg-opacity-40 ${selectionClassName || ''}`}
            style={{
              ...selectionStyle,
              top: Math.min(selectionArea.startY, selectionArea.endY),
              left: Math.min(selectionArea.startX, selectionArea.endX),
              width: Math.abs(selectionArea.startX - selectionArea.endX),
              height: Math.abs(selectionArea.startY - selectionArea.endY),
            }}
          />
        )
      }
    </div>
  );
};

export default Selectable;
