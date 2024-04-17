import getBlockById from '@note-rack/editor/lib/helpers/getBlockByID';
import restoreSelection from '@note-rack/editor/lib/helpers/restoreSelection';
import type KeybindHandler from "@note-rack/editor/types/KeybindHandler";

import type { Interval } from "../helpers/mergeIntervals";
import mergeIntervals from '../helpers/mergeIntervals';
import optionalMergeIntervalValues from "../helpers/intervalMergers/optionalMergeIntervalValues";
import splitOnNonNestables from '../helpers/splitOnNonNestables';

const inlineBlockKeybindFactory = (
  type: string,
  nestableTypes: string[] = [],
  returnIfNonNestable = false,
) => {
  const handler: KeybindHandler['handler'] = (mutations, state, selection, event) => {
    if (!selection?.length || !selection.blockId) return;

    const block = state.find(block => block.id === selection.blockId);

    if (!block) return;

    const style = (block.properties.style || []) as (Interval & { type?: string[] })[]

    if (!Array.isArray(style)) return;

    if (returnIfNonNestable) {
      const newBlockContainsNonNestables = (block.properties.style as (Interval & { type: string[ ]})[]).some(
        (interval) => (
          interval.type.some((intervalType) => !nestableTypes.includes(intervalType))
        )
      )

      event.preventDefault();

      if (newBlockContainsNonNestables) return;
    }

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
      .filter((interval) => (
        interval.type?.includes(type)
        || !interval.type?.every((intervalType) => (nestableTypes.includes(intervalType)))
      ))
      .reduce((acc, interval) => {
        // ~ if the interval is non-nestable ignore it
        if (interval.type?.includes(type)) {
          return acc + interval.end - interval.start;
        }

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

    const updatedStyle = splitOnNonNestables(
      selection.offset,
      selection.offset + selection.length,
      style as (Interval & { type: string[], properties: (Record<string, unknown> | undefined)[] })[],
      nestableTypes
    ).reduce((acc, interval) => {
      interval.type = isAlreadyStyled ? [`-${type}`] : [type];
      interval.properties = [];
      
      acc.push(
        interval
      )

      return mergeIntervals(
        acc,
        optionalMergeIntervalValues
      )
    }, style as Interval[]);

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
