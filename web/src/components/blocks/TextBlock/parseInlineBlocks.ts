import inlineKeybinds from '../../../lib/inlineKeybinds';

export interface ParsedText {
  types: string[],
  value: string,
}

export interface ParsedInlineBlock {
  type: string,
  startIndex: number,
  endIndex: number,
}

const parseInlineBlocks = (text: string) => {
  const parsedInlineBlocks: ParsedInlineBlock[] = [];
  inlineKeybinds.forEach((bind) => {
    let match = bind.keybind.exec(text);

    while (match !== null) {
      parsedInlineBlocks.push({
        type: bind.type,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });

      // ~ Replace the keybind with a string of null characters
      const nullBind = '\u0000'.repeat(bind.plainTextKeybind.length);
      const escapedText = `${nullBind}${match[1]}${nullBind}`;

      text = text.slice(0, match.index) + escapedText + text.slice(match.index + match[0].length);

      match = bind.keybind.exec(text);
    }
  });
    
  const splitText = new Array(text.length).fill(0).map(() => [] as string[]);
  
  parsedInlineBlocks.forEach((block) => {
    for (let i = block.startIndex; i < block.endIndex; i++) {
      splitText[i].push(block.type);
    }
  });

  const parsedText: ParsedText[] = [];
  
  let currentTypes: string[] = [];
  let currentValue = '';

  splitText.forEach((types, index) => {
    if (types.length === currentTypes.length && types.every((type, i) => type === currentTypes[i])) {
      currentValue += text[index];
      return;
    }

    if (currentValue.replace(/\u0000/g, '') !== '') {
      parsedText.push({
        types: currentTypes,
        value: currentValue.replace(/\u0000/g, ''),
      });
    }

    currentTypes = types;
    currentValue = text[index];
  });
  
  if (currentValue.replace(/\u0000/g, '') !== '') {
    parsedText.push({
      types: currentTypes,
      value: currentValue.replace(/\u0000/g, ''),
    });
  }
  
  return parsedText;
};

export default parseInlineBlocks;
