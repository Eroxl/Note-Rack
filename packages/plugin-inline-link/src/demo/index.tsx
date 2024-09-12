import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import createStyledTextRenderer from "@note-rack/editor/components/createStyledTextRenderer";
import inlineBlockRegexFactory from "@note-rack/editor/lib/factories/inlineBlockRegexFactory";

import createInlineLinkRenderer from "../createInlineLinkRenderer";
import InlineBlockRenderer from "@note-rack/editor/types/InlineBlockRenderer";

const inlineBlocks = {
  link: createInlineLinkRenderer(),
} as Record<string, InlineBlockRenderer<any>>;

const Demo: React.FC = () => (
  <Editor
    renderers={{
      text: createStyledTextRenderer({}, ''),
    }}
    inlineBlocks={inlineBlocks}
    startingBlocks={[
      {
        id: "1",
        type: "text",
        properties: {
          text: "Hello, world!",
        },
      },
      {
        id: "2",
        type: "text",
        properties: {
          text: 'this is a link to google.com',
          style: [
            {
              type: ['link'],
              properties: [
                {
                  href: 'https://google.com'
                }
              ],
              start: 18,
              end: 28,
            }
          ]
        }
      },
    ]}
    richTextKeybinds={[
      {
        regex: /()(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&\/=]*) \1/g,
        handler: inlineBlockRegexFactory('link', []),
      }
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);