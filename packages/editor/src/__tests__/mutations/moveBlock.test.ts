import { describe, expect, test } from '@jest/globals';

import moveBlock from '../../mutations/moveBlock';
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
    },
    {
      id: '3',
      type: 'text',
      properties: {}
    }
  ]

  test(
    'Moves a block between two other blocks',
    () => {
      const result = moveBlock(state, '3', '1');

      expect(result).toEqual([
        state[0],
        state[2],
        state[1]
      ]);
    }
  );

  test(
    'Moves a block to the end if no afterId is provided',
    () => {
      const result = moveBlock(state, '1');

      expect(result).toEqual([
        state[1],
        state[2],
        state[0]
      ]);
    }
  );

  test(
    'Does not mutate the original state',
    () => {
      const originalState = [...state];
      moveBlock(state, '3');
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = moveBlock(state, '3');
      expect(result).not.toBe(state);
    }
  );
  
  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => moveBlock(state, 'nonexistentID')).toThrow();
    }
  );
});
