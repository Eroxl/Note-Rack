import { describe, expect, test } from '@jest/globals';

import editBlock from "../../mutations/editBlock";
import EditorState from '../../types/EditorState';

describe('editBlock', () => {
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

  const updatedProperties = {
    color: 'red'
  };

  test(
    'Edits a blocks properties by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties);

      expect(result).toEqual({
        blocks: [
          {
            id: '1',
            type: 'text',
            properties: updatedProperties
          },
          state.blocks[1]
        ]
      });
    }
  );

  test(
    'Edits a blocks type by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties, 'image');

      expect(result).toEqual({
        blocks: [
          {
            id: '1',
            type: 'image',
            properties: updatedProperties
          },
          state.blocks[1]
        ]
      });
    }
  )

  test(
    'Edits both a blocks type and properties by ID',
    () => {
      const result = editBlock(state, '1', updatedProperties, 'image');

      expect(result).toEqual({
        blocks: [
          {
            id: '1',
            type: 'image',
            properties: updatedProperties
          },
          state.blocks[1]
        ]
      });
    }
  )

  test(
    'Does not mutate the original state',
    () => {
      const originalState = {
        ...state,
        blocks: [...state.blocks]
      }
      editBlock(state, '1', updatedProperties);
      expect(state).toEqual(originalState);
    }
  );

  test(
    'Returns a new array',
    () => {
      const result = editBlock(state, '1', updatedProperties);
      expect(result.blocks).not.toBe(state.blocks);
    }
  );

  test(
    'Throws an error when the specified block ID does not exist',
    () => {
      expect(() => editBlock(state, 'nonexistentID', updatedProperties)).toThrow();
    }
  );
});