import getBlockById from '@note-rack/editor/lib/helpers/getBlockByID';
import restoreSelection from '@note-rack/editor/lib/helpers/restoreSelection';
import type KeybindHandler from "@note-rack/editor/types/KeybindHandler";

import type { Interval } from "../helpers/mergeIntervals";
import mergeIntervals from '../helpers/mergeIntervals';
import optionalMergeIntervalValues from "../helpers/intervalMergers/optionalMergeIntervalValues";

const inlineBlockKeybindFactory = (type: string) => {
  const handler: KeybindHandler['handler'] = (mutations, state, selection, event) => {
    if (!selection?.length || !selection.blockId) return;

    const block = state.find(block => block.id === selection.blockId);

    if (!block) return;

    const style = (block.properties.style || []) as (Interval & { type?: string[] })[]

    if (!Array.isArray(style)) return;

    const lengthWithinSelection = style
      .filter((interval) => (
        (
          interval.start >= selection.offset &&
          interval.start < selection.offset + selection.length
        ) ||
        (
          interval.end > selection.offset &&
          interval.end <= selection.offset + selection.length
        )
      ))
      .filter((interval) => interval.type?.includes(type))
      .reduce((acc, interval) => {
        // ~ if the interval is completely within the selection
        if (interval.start >= selection.offset && interval.end <= selection.offset + selection.length) {
          return acc + interval.end - interval.start;
        }

        // ~ if the interval starts before the selection
        if (interval.start < selection.offset) {
          return acc + interval.end - selection.offset;
        }

        // ~ if the interval ends after the selection
        return acc + selection.offset + selection.length - interval.start;
      }, 0)

    const isAlreadyStyled = lengthWithinSelection === selection.length;

    const updatedStyle = mergeIntervals(
      [
        ...(style as Interval[]),
        {
          start: selection.offset,
          end: selection.offset + selection.length,
          type: isAlreadyStyled ? [`-${type}`] : [type],
        }
      ],
      optionalMergeIntervalValues
    );

    mutations.editBlock(selection.blockId, {
      style: updatedStyle,
    })

    const selectionBlock = getBlockById(selection.blockId);

    if (!selectionBlock) return;

    event.preventDefault();
    event.stopPropagation();

    selectionBlock.style.caretColor = 'transparent';

    setTimeout(() => {
      restoreSelection(selection);
    }, 5);
  }

  return handler;
}

export default inlineBlockKeybindFactory;
