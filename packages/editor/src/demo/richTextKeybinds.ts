import type RichTextKeybindHandler from "src/types/RichTextKeybindHandler";

const basicTextHandlerFactory = (type: string) => (
  ((mutations, block, searchResult) => {
    mutations.editBlock(
      block.id,
      {
        text: searchResult[1],
      },
      type
    )
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
];

export default richTextKeybinds;
