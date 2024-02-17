import { describe, expect, test } from '@jest/globals';

import removeBlock from "../../mutations/removeBlock";
import type BlockState from '../../types/BlockState';
import EditorState from '../../types/EditorState';

describe('removeBlock', () => {
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

  test(
    'Removes a block by ID',
    () => {
      const result = removeBlock(state, '1');

      expect(result).toEqual({
        blocks: [
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
        blocks: [...state.blocks],
      }
      removeBlock(state, '1');
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = removeBlock(state, '1');
      expect(result.blocks).not.toBe(state.blocks);
    }
  );

  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => removeBlock(state, 'nonexistentID')).toThrow();
    }
  );
});
