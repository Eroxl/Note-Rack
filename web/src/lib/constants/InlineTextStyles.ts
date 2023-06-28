import inlineTextKeybinds from "../inlineTextKeybinds";

const InlineTextStyles: {
  [key in (typeof inlineTextKeybinds)[number]['type']]: string
} = {
  bold: 'font-bold',
  italic: 'italic',
  underline: 'border-b',
  strikethrough: 'line-through',
} as const;

export default InlineTextStyles;
