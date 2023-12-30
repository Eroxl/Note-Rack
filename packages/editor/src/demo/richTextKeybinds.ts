import type RichTextKeybindHandler from "src/types/RichTextKeybindHandler";
import blockRegexFactory from "src/lib/factories/blockRegexFactory";
import inlineBlockRegexFactory from "src/lib/factories/inlineBlockRegexFactory";

const richTextKeybinds: RichTextKeybindHandler[] = [
  {
    regex:  /^# (.*)/g,
    handler: blockRegexFactory('h1'),
  },
  {
    regex:  /^## (.*)/g,
    handler: blockRegexFactory('h2')
  },
  {
    regex:  /^### (.*)/g,
    handler: blockRegexFactory('h3'),
  },
  {
    regex:  /^#### (.*)/g,
    handler: blockRegexFactory('h4'),
  },
  {
    regex:  /^##### (.*)/g,
    handler: blockRegexFactory('h5'),
  },
  {
    regex: /(\*\*)(.*?)\1/g,
    handler: inlineBlockRegexFactory('bold'),
  },
  {
    regex: /(?<!\*)(\*)(?!\*)(.*?)\1/g,
    handler: inlineBlockRegexFactory('italic'),
  }
];

export default richTextKeybinds;
