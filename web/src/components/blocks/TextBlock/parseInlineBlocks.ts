import inlineKeybinds from '../../../lib/inlineKeybinds';

/**
 * A parsed text object is the result of parsing a markdown string for inline blocks.
 */
export interface ParsedText {
  types: string[],
  value: string,
}

/**
 * A parsed inline block is the result of parsing a markdown string for inline blocks.
 * It contains the type of the inline block, as well as the start and end index of the block
 * inside the markdown string.
 */
export interface ParsedInlineBlock {
  type: string,
  startIndex: number,
  endIndex: number,
}

/**
 * Parses text into an array of ParsedText objects, which contain the 
 * plain text value of the text, as well as an array of types that apply 
 * to that text. Each type is a string, and is the name of a block type 
 * that applies to that text.
 * @param text The text to parse.
 * @returns An array of ParsedText objects.
 * 
 * @example 
 * const text = "Hello *world*!";
 * const parsedText = parseInlineBlocks(text);
 * 
 * console.log(parsedText);
 * // [
 * //  {
 * //    types: [],
 * //    value: "Hello ",
 * //  },
 * //  {
 * //    types: ["italic"],
 * //    value: "world",
 * //  },
 * //  {
 * //    types: [],
 * //    value: "!",
 * //  },
 * // ]
 */
const parseInlineBlocks = (text: string) => {
  // ~ This is a list of all the inline blocks that have been parsed.
  const parsedInlineBlocks: ParsedInlineBlock[] = [];

  // ~ Iterate through all the inline keybinds
  inlineKeybinds.forEach((bind) => {
    // ~ Search for a match for a keybind
    let match = bind.keybind.exec(text);

    // ~ While there are still matches for the keybind
    while (match !== null) {
      // ~ Add the parsed inline block to the list of parsed inline blocks
      parsedInlineBlocks.push({
        type: bind.type,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });

      // ~ Escape the keybind by adding null characters before and after it
      const nullBind = '\u0000'.repeat(bind.plainTextKeybind.length);
      const escapedText = `${nullBind}${match[1]}${nullBind}`;

      // ~ Replace the keybind with the null characters
      text = text.slice(0, match.index) + escapedText + text.slice(match.index + match[0].length);

      // ~ Search for a new match for the keybind
      match = bind.keybind.exec(text);
    }
  });
    
  // ~ Split the text into an array of arrays, each of which contains the inline
  //   block types associated with the corresponding character
  const splitText = new Array(text.length).fill(0).map(() => [] as string[]);
  
  parsedInlineBlocks.forEach((block) => {
    for (let i = block.startIndex; i < block.endIndex; i++) {
      splitText[i].push(block.type);
    }
  });

  const parsedText: ParsedText[] = [];
  
  let currentTypes: string[] = [];
  let currentValue = '';

   // ~ Iterate over each character in the text
  splitText.forEach((types, index) => {
    // ~ If the type of the current character is the same as the last character
    if (types.length === currentTypes.length && types.every((type, i) => type === currentTypes[i])) {
      // ~ Add the character to the current value
      currentValue += text[index];
      return;
    }

    // ~ If the current value is not empty
    if (currentValue.replace(/\u0000/g, '') !== '') {
      // ~ Push the current value and type to the parsed text
      parsedText.push({
        types: currentTypes,
        value: currentValue.replace(/\u0000/g, ''),
      });
    }

    // ~ Set the current type to the current character's type
    currentTypes = types;
    // ~ Set the current value to the current character
    currentValue = text[index];
  });
  
  // ~ If the current value is empty, return the parsed text
  if (currentValue.replace(/\u0000/g, '') === '') return parsedText;
    
  // ~ Push the last value and type to the parsed text
  parsedText.push({
    types: currentTypes,
    value: currentValue.replace(/\u0000/g, ''),
  });

  return parsedText;
};

export default parseInlineBlocks;
