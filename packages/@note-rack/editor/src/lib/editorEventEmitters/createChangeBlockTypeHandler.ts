import React from "react";

import type Block from '../../types/Block';
import type {
  ChangeBlockTypeHandler
} from '../../types/EditorEventEmitters';

type SetCurrentData = React.Dispatch<React.SetStateAction<Block[]>>;

/**
 * Creates a handler that changes the block type of a block in the editor.
 * @param setCurrentData The function that sets the current data.
 * @returns The handler.
 */
const createChangeBlockTypeHandler = (setCurrentData: SetCurrentData): ChangeBlockTypeHandler => (
  (index, blockType, blockID) => {
    setCurrentData((prevData) => {
      const newData = prevData.slice();

      if (blockID && newData[index]._id !== blockID) {
        throw new Error('Block ID does not match.');
      }

      newData[index].blockType = blockType;

      return newData;
    }
    );
  }
);

export default createChangeBlockTypeHandler;
