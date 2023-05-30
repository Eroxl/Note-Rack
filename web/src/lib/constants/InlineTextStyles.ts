import inlineTextKeybinds from "../inlineTextKeybinds";

const InlineTextStyles: {
  [key: (typeof inlineTextKeybinds)[number]['type']]: string
} = {
  bold: 'font-bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'line-through',
};

export default InlineTextStyles;
