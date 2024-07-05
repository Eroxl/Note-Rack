import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createStyledText from "../createStyledTextRenderer";
import inlineBlockKeybindFactory from "../factories/inlineBlockKeybindFactory";
import inlineBlockRegexFactory from "../factories/inlineBlockRegexFactory";
import InlineBlockRenderer from "../types/InlineBlockRenderer";

const inlineBlocks: Record<string, InlineBlockRenderer<Record<string, unknown>>> = {
  bold: ({ children }) => (
    <strong>{children}</strong>
  ),
  italic: ({children}) => (
    <i>{children}</i>
  ),
};

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
          text: 'Bold text and more text',
          style: [
            {
              type: ['bold'],
              start: 0,
              end: 4,
            },
          ]
        }
      },
    ]}
    keybinds={[
      {
        handler: inlineBlockKeybindFactory('bold', ['italic', 'bold']),
        keybind: 'Meta+b',
      },
      {
        handler: inlineBlockKeybindFactory('italic', ['italic', 'bold',]),
        keybind: 'Meta+i',
      }
    ]}
    richTextKeybinds={[
      {
        regex: /^red (.*)/g,
        handler: blockRegexFactory('red-text'),
      },
      {
        regex: /(\*\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory(
          'bold',
          ['italic', 'bold']
        ),
      },
      {
        regex: /(\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory(
          'italic',
          ['italic', 'bold']
        )
      },
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);