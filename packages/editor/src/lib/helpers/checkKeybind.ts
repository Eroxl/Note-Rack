import type { ValidKeys, NumberKey, UppercaseKey, LowercaseKey } from '../../types/Keybind';
import type Keybind from '../../types/Keybind';
import type Split from '../../types/helpers/Split';
import type ReverseArr from '../../types/helpers/ReverseArr';
import checkModifers from './checkModifers';

/**
 * Map of special keys to their key codes.
 */
const SPECIAL_KEY_MAP = {
  '`': 'Backquote',
  '\'': 'Quote',
  '/': 'Slash',
  ",": 'Comma',
  "-": 'Minus',
  ".": 'Period',
  "=": 'Equal',
  ";": 'Semicolon',
  "[": 'BracketLeft',
  "]": 'BracketRight',
  "\\": 'Backslash',
  Enter: 'Enter',
  Space: 'Space',
  Tab: 'Tab'
} as const;

type ValidKeyCodes = (
  `Key${UppercaseKey}` |
  `Digit${NumberKey}` |
  typeof SPECIAL_KEY_MAP[keyof typeof SPECIAL_KEY_MAP]
)

const isAlpha = (key: string): key is UppercaseKey | LowercaseKey => {
  if (key.length !== 1) return false;

  return /[a-zA-Z]/.test(key);
}

const isNumber = (key: string): key is NumberKey => {
  if (key.length !== 1) return false;

  return /[0-9]/.test(key);
}

const keyToKeyCode = (key: ValidKeys): ValidKeyCodes => {
  if (isAlpha(key)) return `Key${key.toUpperCase() as UppercaseKey}`;

  if (isNumber(key)) return `Digit${key}`;

  return SPECIAL_KEY_MAP[key];
};

/**
 * Check if a keybind matches a keyboard event.
 * @param keybind The keybind to check.
 * @param event The keyboard event to check.
 */
const checkKeybind = (keybind: Keybind, event: KeyboardEvent): boolean => {
  const keybindParts = keybind
    .split('+') as Split<Keybind, '+'>;

  const [key, ...modifiers] = keybindParts.reverse() as ReverseArr<typeof keybindParts>;

  if (keyToKeyCode(key) !== event.code) return false;

  if (!checkModifers(modifiers, event)) return false;

  return true;
};

export type { ValidKeyCodes };
export { keyToKeyCode, isAlpha, isNumber, SPECIAL_KEY_MAP };

export default checkKeybind;
