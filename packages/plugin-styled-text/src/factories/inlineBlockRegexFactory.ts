import restoreSelection from "@note-rack/editor/lib/helpers/restoreSelection";
import type RichTextKeybindHandler from "@note-rack/editor/types/RichTextKeybindHandler";

import mergeIntervals from "../helpers/mergeIntervals";
import type { Interval } from "../helpers/mergeIntervals";
import splitOnNonNestables from "../helpers/splitOnNonNestables";

const inlineBlockRegexFactory = (
  type: string,
  nestableTypes: string[] = [],
  returnIfNonNestable = false,
) => (
  ((mutations, block, searchResult, selection) => {
    if (
      !selection||
      !searchResult[2]?.length ||
      typeof block.properties.text !== 'string'
    ) return;

    const [
      fullMatch,
      bind,
      fullMatchWithoutBind,
    ] = searchResult;

    if (
      fullMatch === undefined
      || bind === undefined
      || fullMatchWithoutBind === undefined
    ) return;

    const before = block.properties.text.slice(0, searchResult.index);
    const after = block.properties.text.slice(searchResult.index + fullMatch.length - 1);

    if (returnIfNonNestable) {
      const newBlockContainsNonNestables = (block.properties.style as (Interval & { type: string[ ]})[]).some(
        (interval) => (
          interval.type.some((intervalType) => !nestableTypes.includes(intervalType))
        )
      )

      if (newBlockContainsNonNestables) return;
    }

    const text = `${before}${fullMatchWithoutBind}${after}`;

    (block.properties.style as Interval[])?.forEach((style) => {
      if (
        style.start < searchResult.index ||
        style.end > searchResult.index + fullMatch.length - (bind.length * 2)
      ) return;

      style.start -= bind.length
      style.end -= bind.length;
    })

    const updatedStyle = splitOnNonNestables(
      searchResult.index,
      searchResult.index + fullMatch.length - (bind.length * 2),
      block.properties.style as (Interval & { type: string[], properties: (Record<string, unknown> | undefined)[] })[],
      nestableTypes
    ).reduce((acc, interval) => {
      interval.type = [type];
      interval.properties = [undefined];

      acc.push(
        interval
      )

      return mergeIntervals(acc)
    }, block.properties.style as Interval[]);

    mutations.editBlock(
      block.id,
      {
        text,
        style: updatedStyle,
      },
    );

    // ~ Handle correctly moving the cursor to the same spot after
    //   the inline block is rendered

    // ~ If the cursor is before the match, do nothing
    if (searchResult.index > selection.offset) return;

    // ~ If the cursor is in the middle of the match, subtract the
      //   length of the keybind from the cursor offset, otherwise
    //   subtract the length of the keybind times 2.
    const isAfterFullMatch = searchResult.index + fullMatch.length >= selection.offset;

    selection.offset -= (bind.length || 0) * (isAfterFullMatch ? 2 : 1);

    // ~ If the cursor as at the end of the element, we need to
    //   increment the cursor offset by 1
    if (selection.offset === block.properties.text.length) {
      selection.offset += 1;
    }

    // ~ Wait for the block to be rendered
    setTimeout(() => {
      restoreSelection(
        selection,
      )
    });
  }) as RichTextKeybindHandler['handler']
)

export default inlineBlockRegexFactory;
