import { describe, expect, test } from '@jest/globals';

import addBlock from "../../mutations/addBlock";
import type EditorState from '../../types/EditorState';

describe('addBlock', () => {
  const state: EditorState = {
    blocks: [
      {
        id: '1',
        type: 'text',
        properties: {}
      },
      {
        id: '2',
        type: 'text',
        properties: {}
      }
    ]
  }

  const newBlock = {
    id: '3',
    type: 'text',
    properties: {}
  };

  test(
    'Adds a block to the end of the block list when no ID is specified',
    () => {
      const result = addBlock(state, newBlock);

      expect(result).toEqual({
        blocks: [
          ...state.blocks,
          newBlock
        ]
      });
    }
  );

  test(
    'Adds a block after the specified block ID',
    () => {
      const result = addBlock(
        state,
        newBlock,
        '1'
      );

      expect(result).toEqual({
        blocks: [
          state.blocks[0],
          newBlock,
          state.blocks[1]
        ]
      });
    }
  );

  test(
    'Does not mutate the original state',
    () => {
      const originalState = { 
        ...state,
        blocks: [...state.blocks]
      };

      addBlock(state, newBlock);
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = addBlock(state, newBlock);
      expect(result.blocks).not.toBe(state.blocks);
    }
  );
  
  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => addBlock(state, newBlock, 'nonexistentID')).toThrow();
    }
  );
});
