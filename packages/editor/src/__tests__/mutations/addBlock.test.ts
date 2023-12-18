import { describe, expect, test } from '@jest/globals';

import addBlock from "../../mutations/addBlock";
import type BlockState from '../../types/BlockState';

describe('addBlock', () => {
  const state: BlockState[] = [
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

  const newBlock = {
    id: '3',
    type: 'text',
    properties: {}
  };

  test(
    'Adds a block to the end of the block list when no ID is specified',
    () => {
      const result = addBlock(state, newBlock);

      expect(result).toEqual([
        ...state,
        newBlock
      ]);
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

      expect(result).toEqual([
        state[0],
        newBlock,
        state[1]
      ]);
    }
  );

  test(
    'Does not mutate the original state',
    () => {
      const originalState = [...state];
      addBlock(state, newBlock);
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = addBlock(state, newBlock);
      expect(result).not.toBe(state);
    }
  );
  
  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => addBlock(state, newBlock, 'nonexistentID')).toThrow();
    }
  );
});
