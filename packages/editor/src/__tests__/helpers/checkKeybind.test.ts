import { describe, expect, test } from '@jest/globals';
import type { KeyboardEvent } from 'react';

import checkKeybind from "../../helpers/checkKeybind";
import type { Keybind } from '../../types/Keybind';

describe('checkKeybind', () => {
  test(
    'Returns true when the keybind combination matches',
    () => {
      const keybind: Keybind = 'Control+Shift+A';

      const event = {
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(true);
    }
  );

  test(
    'Returns false when the keybind combination does not match',
    () => {
      const keybind: Keybind = 'Control+Shift+Z';

      const event = {
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(false);
    }
  );

  test(
    'Returns true when the keybind combination without modifiers matches',
    () => {
      const keybind: Keybind = 'A';

      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(true);
    }
  );

  test(
    'Returns false when the keybind combination with modifiers does not matchs',
    () => {
      const keybind: Keybind = 'Control+A';

      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(false);
    }
  );

  test(
    'Returns true when the keybind combination includes the Meta key and matchess',
    () => {
      const keybind: Keybind = 'Meta+A';

      const event = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
        code: 'KeyA'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(true);
    }
  );

  // Test with a keybind combination that includes a number key
  test(
    'Returns true when the keybind combination includes a number key and matchess',
    () => {
      const keybind: Keybind = 'Control+1';

      const event = {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        code: 'Digit1'
      } as KeyboardEvent;

      expect(checkKeybind(keybind, event)).toBe(true);
    }
  );
});
