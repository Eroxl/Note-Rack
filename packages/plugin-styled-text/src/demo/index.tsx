import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createStyledText from "../createStyledTextRenderer";
import InlineBlockRenderer from "../types/InlineBlockRenderer";
import inlineBlockKeybindFactory from "../factories/inlineBlockKeybindFactory";
import inlineBlockRegexFactory from "../factories/inlineBlockRegexFactory";

const inlineBlocks: Record<string, InlineBlockRenderer> = {
  bold: ({children}) => (
    <strong>{children}</strong>
  ),
}

const Demo: React.FC = () => (
  <Editor
    renderers={{
      text: createStyledText({}, '', inlineBlocks),
      'red-text': createStyledText({color: 'red'}, '', inlineBlocks),
    }}
    startingBlocks={[
      {
        id: "1",
        type: "red-text",
        properties: {
          text: "Hello, world!",
        },
      },
      {
        id: "2",
        type: "text",
        properties: {
          text: 'Bold text',
          style: [
            {
              type: ['bold'],
              start: 0,
              end: 4,
            }
          ]
        }
      },
    ]}
    keybinds={[
      {
        handler: inlineBlockKeybindFactory('bold'),
        keybind: 'Meta+b',
      },
    ]}
    richTextKeybinds={[
      {
        regex: /^red (.*)/g,
        handler: blockRegexFactory('red-text'),
      },
      {
        regex: /(\*\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory('bold'),
      },
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);