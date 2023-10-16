import type { StringToUnion } from "./helpers/StringToUnion"

type LowercaseKey = StringToUnion<'abcdefghijklmnopqrstuvwxyz'>
type UppercaseKey = StringToUnion<'ABCDEFGHIJKLMNOPQRSTUVWXYZ'>
type NumberKey = StringToUnion<'0123456789'>
type SpecialKey = (
  StringToUnion<'`-=[]\\;\',./'> |
  'Enter' |
  'Space' |
  'Tab'
)

type ModifierKey = (
  'Alt' |
  'Control' |
  'Meta'
)

type ShiftKey = 'Shift'

/**
 * Valid keys for shortcuts.
 */
type ValidKeys = (
  | LowercaseKey
  | UppercaseKey
  | NumberKey
  | SpecialKey
)

/**
 * A combination of modifier keys that is unique.
 */
type UniqueModifierCombination = (
  | ModifierKey
  | `${ModifierKey}+${ShiftKey}`
)

/**
 * Valid keybinds for blocks and shortcuts.
 */
type Keybind = (
  | ValidKeys
  | `${UniqueModifierCombination}+${ValidKeys}`
)

export type {
  LowercaseKey,
  UppercaseKey,
  NumberKey,
  SpecialKey,
  ValidKeys,
  Keybind
};
