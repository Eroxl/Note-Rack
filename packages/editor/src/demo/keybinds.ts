import mergeIntervals, { type Interval } from "src/lib/helpers/mergeIntervals";
import type KeybindHandler from "src/types/KeybindHandler";

const keybinds: KeybindHandler[] = [
  {
    handler: (mutations, state, selection) => {
      if (!selection?.length || !selection.blockId) return;

      const block = state.find(block => block.id === selection.blockId);

      if (!block) return;

      const style = block.properties.style || [];

      if (!Array.isArray(style)) return;

      const updatedStyle = mergeIntervals([
        ...(style as Interval[]),
        {
          start: selection.offset,
          end: selection.offset + selection.length,
        }
      ])

      mutations.editBlock(selection.blockId, {
        style: updatedStyle,
      })
    },
    keybind: 'Meta+b',
  }
];

export default keybinds;
