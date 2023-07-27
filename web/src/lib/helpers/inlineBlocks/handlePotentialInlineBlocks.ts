import InlineTextStyles from "../../constants/InlineTextStyles";
import inlineTextKeybinds from "../../inlineTextKeybinds";
import getCursorOffset from "../caret/getCursorOffset";
import focusElement from "../focusElement";
import findNodesInRange from "./findNodesInRange";
import renderNewInlineBlocks from "./renderNewInlineBlocks";

/**
 * Style an inline block
 * @param element The parent block of the inline block
 * @param inlineBlock The inline block
 * @param type The type of inline block
 */
export const styleInlineBlock = (
  element: HTMLSpanElement,
  inlineBlock: {
    start: number,
    end: number,
    bindLength: number,
  },
  type: keyof typeof InlineTextStyles,
) => {
  const { start, end, bindLength } = inlineBlock;

  const nodesInRange = findNodesInRange(
    element,
    {
      start,
      end,
    }
  )

  // ~ Quietly render the inline blocks using the DOM instead of
  //   React to avoid a full re-render of the block
  renderNewInlineBlocks(
    nodesInRange.nodes,
    InlineTextStyles[type],
    type,
    nodesInRange.startOffset,
    {
      start,
      end,
      bindLength,
    },
  );
};

/**
 * Handle the user potentially typing a inline block keybind
 * @param element The element to check for keybinds
 */
const handlePotentialInlineBlocks = async (
  element: HTMLSpanElement
) => {
  let cursorOffset = getCursorOffset(element);

  for (let i = 0; i < inlineTextKeybinds.length; i++) {
    const bind = inlineTextKeybinds[i];

    const regexSearch = bind.keybind.exec(element.textContent || '');

    if (!regexSearch || !regexSearch[2].length) continue;

    styleInlineBlock(
      element,
      {
        start: regexSearch.index,
        end: regexSearch.index + regexSearch[0].length,
        bindLength: regexSearch[1].length
      },
      bind.type,
    );

    // ~ Handle correctly moving the cursor to the same spot after
    //   the inline block is rendered

    // ~ If the cursor is before the match, do nothing
    if (regexSearch?.index > cursorOffset) break;

    // ~ If the cursor is in the middle of the match, subtract the
    //   length of the keybind from the cursor offset, otherwise
    //   subtract the length of the keybind times 2.
    const isAfterFullMatch = regexSearch?.index + regexSearch?.[0]?.length >= cursorOffset;

    cursorOffset -= (regexSearch?.[1]?.length || 0) * (isAfterFullMatch ? 2 : 1);
    
    // ~ If the cursor as at the end of the element, we need to
    //   increment the cursor offset by 1
    if (cursorOffset === (element.textContent?.length || 0)) {
      cursorOffset += 1;
    }

    setTimeout(() => {
      focusElement(element, cursorOffset);
    }, 0);
  
    break;
  }
};

export default handlePotentialInlineBlocks;