import restoreSelection from "@note-rack/editor/lib/helpers/restoreSelection";
import type RichTextKeybindHandler from "@note-rack/editor/types/RichTextKeybindHandler";

import mergeIntervals from "../helpers/mergeIntervals";
import type { Interval } from "../helpers/mergeIntervals";

const inlineBlockRegexFactory = (
  type: string,
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

    const text = `${before}${fullMatchWithoutBind}${after}`;

    const newStyle = {
      start: searchResult.index,
      end: searchResult.index + fullMatch.length - (bind.length * 2),
      type: [type],
    };

    mutations.editBlock(
      block.id,
      {
        text,
        style: mergeIntervals([
          newStyle,
          ...((block.properties.style as Interval[]) || []),
        ])
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
