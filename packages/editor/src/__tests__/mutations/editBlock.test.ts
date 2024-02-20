import { describe, expect, test } from '@jest/globals';

import editBlock from "../../mutations/editBlock";
import type BlockState from '../../types/BlockState';

describe('editBlock', () => {
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

  const updatedProperties = {
    color: 'red'
  };

  test(
    'Edits a blocks properties by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties);

      expect(result).toEqual([
        {
          id: '1',
          type: 'text',
          properties: updatedProperties
        },
        state[1]
      ]);
    }
  );

  test(
    'Edits a blocks type by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties, 'image');

      expect(result).toEqual([
        {
          id: '1',
          type: 'image',
          properties: updatedProperties
        },
        state[1]
      ]);
    }
  )

  test(
    'Edits both a blocks type and properties by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties, 'image');

      expect(result).toEqual([
        {
          id: '1',
          type: 'image',
          properties: updatedProperties
        },
        state[1]
      ]);
    }
  )

  test(
    'Does not mutate the original state',
    () => {
      const originalState = [...state];
      editBlock(state, '1', updatedProperties);
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = editBlock(state, '1', updatedProperties);
      expect(result).not.toBe(state);
    }
  );

  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => editBlock(state, 'nonexistentID', updatedProperties)).toThrow();
    }
  );
});