import React from 'react';
import { ConnectDragSource } from 'react-dnd/src/types/index';

type HandleProps = {
  innerRef: ConnectDragSource,
};

const createHandle = (
  handleIcon?: React.ReactNode,
  style?: React.CSSProperties,
  className?: string,
) => {
  const Handle: React.FC<HandleProps> = ({ innerRef }) => {
    return (
      <div
        style={style}
        className={className}
        ref={innerRef}
      >
        {handleIcon}
      </div>
    );
  };

  return Handle;
}

export default createHandle;
