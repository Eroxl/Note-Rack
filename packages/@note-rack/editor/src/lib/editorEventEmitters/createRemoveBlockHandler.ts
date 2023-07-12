import React from "react";

import type Block from '../../types/Block';
import type {
  RemoveBlockHandler
} from '../../types/EditorEventEmitters';

type SetCurrentData = React.Dispatch<React.SetStateAction<Block[]>>;

/**
 * Creates a handler that removes a block from the editor.
 * @param setCurrentData The function that sets the current data.
 * @returns The handler.
 */
const createRemoveBlockHandler = (setCurrentData: SetCurrentData): RemoveBlockHandler => (
  (index, blockID) => {
    setCurrentData((prevData) => {
      const newData = prevData.slice();

      const oldBlock = newData.splice(index, 1);

      if (blockID && oldBlock[0]._id !== blockID) {
        throw new Error('Block ID does not match.');
      }

      return newData;
    });
  }
);

export default createRemoveBlockHandler;
