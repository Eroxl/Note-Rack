import React from "react";

import type Block from '../../types/Block';
import type {
  InsertBlockHandler
} from '../../types/EditorEventEmitters';
import generateID from "../../helpers/generateID";

type SetCurrentData = React.Dispatch<React.SetStateAction<Block[]>>;

/**
 * Creates a handler that inserts a block into the editor.
 * @param setCurrentData The function that sets the current data.
 * @returns The handler.
 */
const createInsertBlock = (setCurrentData: SetCurrentData): InsertBlockHandler => (
  (block, index) => {
    setCurrentData((prevData) => {
      let newBlockID = generateID();

      // ~ Ensure that the block ID is unique
      while (true) {
        if (prevData.find((block) => block._id === newBlockID)) {
          newBlockID = generateID();
          continue;
        }

        break;
      }

      const newData = prevData.slice();

      newData.splice(index, 0, {
        ...block,
        _id: newBlockID,
      });

      return newData;
    });
  }
);

export default createInsertBlock;
