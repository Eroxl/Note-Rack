import { describe, expect, test } from '@jest/globals';

import checkModifers from '../../lib/helpers/checkModifers';

describe('checkModifers', () => {
  test(
    'Should return true if no modifiers are required',
    () => {
      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers([], event)).toBe(true);
    }
  );

  test(
    'Should return true if all modifiers are required and pressed',
    () => {
      const event = {
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers(['Alt', 'Control', 'Meta', 'Shift'], event)).toBe(true);
    }
  );

  test(
    'Should return false if all modifiers are required but not pressed',
    () => {
      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers(['Alt', 'Control', 'Meta', 'Shift'], event)).toBe(false);
    }
  );

  test(
    'Should return true if one modifier is required and pressed',
    () => {
      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        metaKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers(['Alt'], event)).toBe(true);
    }
  );

  test(
    'Should return false if one modifier is pressed but not required',
    () => {
      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        metaKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers(['Control'], event)).toBe(false);
    }
  )

  test(
    'Should return false if one modifier is required but not pressed',
    () => {
      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers(['Alt'], event)).toBe(false);
    }
  );

  test(
    'Should return true if multiple modifiers are pressed and but no keys are required',
    () => {
      const event = {
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkModifers([], event)).toBe(false);
    }
  )
});
