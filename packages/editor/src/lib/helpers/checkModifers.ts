import type { ModifierKey, ShiftKey } from '../../types/Keybind';

const checkModifers = (modifers: (ModifierKey | ShiftKey)[], event: KeyboardEvent): boolean => {
  const modifierToEventsMap = {
    altKey: 'Alt',
    ctrlKey: 'Control',
    metaKey: 'Meta',
    shiftKey: 'Shift',
  } as const;

  for (const eventKey of Object.keys(modifierToEventsMap)) {
    const isModifierPressed = event[eventKey as keyof typeof modifierToEventsMap];
    const isModifierRequired = modifers.includes(modifierToEventsMap[eventKey as keyof typeof modifierToEventsMap]);

    if (isModifierPressed === undefined) continue;

    if (isModifierRequired !== isModifierPressed) return false;
  }

  return true;
}

export default checkModifers;
