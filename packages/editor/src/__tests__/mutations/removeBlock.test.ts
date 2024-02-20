import { describe, expect, test } from '@jest/globals';

import removeBlock from "../../mutations/removeBlock";
import type BlockState from '../../types/BlockState';

describe('removeBlock', () => {
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

  test(
    'Removes a block by ID',
    () => {
      const result = removeBlock(state, '1');

      expect(result).toEqual([
        state[1]
      ]);
    }
  );

  test(
    'Does not mutate the original state',
    () => {
      const originalState = [...state];
      removeBlock(state, '1');
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = removeBlock(state, '1');
      expect(result).not.toBe(state);
    }
  );

  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => removeBlock(state, 'nonexistentID')).toThrow();
    }
  );
});
