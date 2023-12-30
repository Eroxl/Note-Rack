import focusElement from "src/lib/helpers/focusElement";
import getBlockById from "src/lib/helpers/getBlockByID";
import mergeIntervals, { type Interval } from "src/lib/helpers/mergeIntervals";
import restoreSelection from "src/lib/helpers/restoreSelection";
import type RichTextKeybindHandler from "src/types/RichTextKeybindHandler";

const basicTextHandlerFactory = (type: string) => (
  ((mutations, block, searchResult) => {
    mutations.editBlock(
      block.id,
      {
        text: searchResult[1],
      },
      type
    );


    setTimeout(() => {
      const blockElement = getBlockById(block.id);

      if (!blockElement) return;

      focusElement(blockElement, 0);
    })
  }) as RichTextKeybindHandler['handler']
)

const basicInlineTextHandlerFactory = (
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

    if (!fullMatch || !bind || !fullMatchWithoutBind) return;

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
    const isAfterFullMatch = searchResult.index + searchResult[0].length >= selection.offset;

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

const richTextKeybinds: RichTextKeybindHandler[] = [
  {
    regex:  /^# (.*)/g,
    handler: basicTextHandlerFactory('h1'),
  },
  {
    regex:  /^## (.*)/g,
    handler: basicTextHandlerFactory('h2')
  },
  {
    regex:  /^### (.*)/g,
    handler: basicTextHandlerFactory('h3'),
  },
  {
    regex:  /^#### (.*)/g,
    handler: basicTextHandlerFactory('h4'),
  },
  {
    regex:  /^##### (.*)/g,
    handler: basicTextHandlerFactory('h5'),
  },
  {
    regex: /(\*\*)(.*?)\1/g,
    handler: basicInlineTextHandlerFactory('bold'),
  },
  {
    regex: /(?<!\*)(\*)(?!\*)(.*?)\1/g,
    handler: basicInlineTextHandlerFactory('italic'),
  }
];

export default richTextKeybinds;
