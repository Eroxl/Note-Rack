import mergeIntervals, { type Interval } from "src/lib/helpers/mergeIntervals";
import type KeybindHandler from "src/types/KeybindHandler";
import restoreSelection from "src/lib/helpers/restoreSelection";
import getBlockById from "src/lib/helpers/getBlockByID";

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
          type: ['bold'],
        }
      ])

      mutations.editBlock(selection.blockId, {
        style: updatedStyle,
      })

      const selectionBlock = getBlockById(selection.blockId);

      if (!selectionBlock) return;

      selectionBlock.style.caretColor = 'transparent';

      setTimeout(() => {
        restoreSelection(selection);
      }, 0);
    },
    keybind: 'Meta+b',
  }
];

export default keybinds;
