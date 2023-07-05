import inlineTextKeybinds from "../inlineTextKeybinds";

const InlineTextStyles: {
  [key in (typeof inlineTextKeybinds)[number]['type']]: string
} = {
  bold: 'font-bold',
  italic: 'italic',
  underline: 'border-b-[0.1em] dark:border-amber-50 print:dark:border-black border-black',
  strikethrough: 'line-through',
} as const;

export default InlineTextStyles;
