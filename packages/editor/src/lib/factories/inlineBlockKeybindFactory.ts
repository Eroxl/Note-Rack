import mergeIntervals from "../../lib/helpers/mergeIntervals";
import type { Interval } from "../../lib/helpers/mergeIntervals";
import type KeybindHandler from "../../types/KeybindHandler";
import restoreSelection from "../../lib/helpers/restoreSelection";
import getBlockById from "../../lib/helpers/getBlockByID";
import xOrMergeIntervalValues from "../../lib/helpers/xOrMergeIntervalValues";

const inlineBlockKeybindFactory = (type: string) => {
  const handler: KeybindHandler['handler'] = (mutations, state, selection) => {
    if (!selection?.length || !selection.blockId) return;

    const block = state.find(block => block.id === selection.blockId);

    if (!block) return;

    const style = block.properties.style || [];

    if (!Array.isArray(style)) return;

    const updatedStyle = mergeIntervals(
      [
        ...(style as Interval[]),
        {
          start: selection.offset,
          end: selection.offset + selection.length,
          type: [type],
        }
      ],
      xOrMergeIntervalValues
    );

    mutations.editBlock(selection.blockId, {
      style: updatedStyle,
    })

    const selectionBlock = getBlockById(selection.blockId);

    if (!selectionBlock) return;

    selectionBlock.style.caretColor = 'transparent';

    setTimeout(() => {
      restoreSelection(selection);
    }, 5);
  }

  return handler;
}

export default inlineBlockKeybindFactory;
