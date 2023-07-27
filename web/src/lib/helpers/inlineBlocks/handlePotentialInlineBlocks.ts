import InlineTextStyles from "../../constants/InlineTextStyles";
import inlineTextKeybinds from "../../inlineTextKeybinds";
import getCursorOffset from "../caret/getCursorOffset";
import focusElement from "../focusElement";
import findNodesInRange from "./findNodesInRange";
import renderNewInlineBlocks from "./renderNewInlineBlocks";

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

    const nodesInRange = findNodesInRange(
      element,
      {
        start: regexSearch.index,
        end: regexSearch.index + regexSearch[0].length,
      }
    )

    // ~ Quietly render the inline blocks using the DOM instead of
    //   React to avoid a full re-render of the block
    renderNewInlineBlocks(
      nodesInRange.nodes,
      InlineTextStyles[bind.type],
      bind.type,
      nodesInRange.startOffset,
      {
        start: regexSearch.index,
        end: regexSearch.index + regexSearch[0].length,
        bindLength: regexSearch[1].length,
      },
      element,
    )

    // ~ Handle correctly moving the cursor to the same spot after
    //   the inline block is rendered

    // ~ If the cursor is before the match, do nothing
    if (regexSearch?.index > cursorOffset) break;

    // ~ If the cursor is in the middle of the match, subtract the
    //   length of the keybind from the cursor offset, otherwise
    //   subtract the length of the keybind times 2.
    const isAfterFullMatch = regexSearch?.index + regexSearch?.[0]?.length >= cursorOffset;

    cursorOffset -= (regexSearch?.[1]?.length || 0) * (isAfterFullMatch ? 2 : 1);
    break;
  }

  setTimeout(() => {
    focusElement(element, cursorOffset);
  }, 0);
};

export default handlePotentialInlineBlocks;