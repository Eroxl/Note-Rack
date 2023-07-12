import React from "react";

import type Block from '../../types/Block';
import type {
  ChangeBlockDataHandler,
} from '../../types/EditorEventEmitters';

type SetCurrentData = React.Dispatch<React.SetStateAction<Block[]>>;

/**
 * Creates a handler that changes the block data of a block in the editor.
 * @param setCurrentData The function that sets the current data.
 * @returns The handler.
 */
const createChangeBlockDataHandler = (setCurrentData: SetCurrentData): ChangeBlockDataHandler => (
  (index, changes, blockID) => {
    setCurrentData((prevData) => {
      const newData = prevData.slice();

      if (blockID && newData[index]._id !== blockID) {
        throw new Error('Block ID does not match.');
      }

      changes.forEach((change) => {
        switch (change.type) {
          case 'addition':
            newData[index].properties[change.key] = change.value;
            break;

          case 'deletion':
            delete newData[index].properties[change.key];
            break;

          case 'change':
            if (change.diff.type === 'addition') {
              const currentValue = newData[index].properties[change.key];

              if (typeof currentValue !== 'string') {
                throw new Error('Cannot add to non-string value.');
              }

              const before = currentValue.slice(0, change.diff.position);
              const after = currentValue.slice(change.diff.position);

              newData[index].properties[change.key] = before + change.diff.value + after
            } else {
              const currentValue = newData[index].properties[change.key];

              if (typeof currentValue !== 'string') {
                throw new Error('Cannot remove from non-string value.');
              }

              const before = currentValue.slice(0, change.diff.position);
              const after = currentValue.slice(change.diff.position + change.diff.length);

              newData[index].properties[change.key] = before + after;
            }
            break;
        }
      });

      return newData;
    });
  }
);

export default createChangeBlockDataHandler;
