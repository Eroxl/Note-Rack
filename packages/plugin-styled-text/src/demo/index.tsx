import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import mergeObject from "@note-rack/editor/lib/helpers/mergeObjects";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createStyledTextPlugin from "../createStyledTextPlugin";
import createStyledText from "../createStyledText";
import InlineBlockRenderer from "../types/InlineBlockRenderer";
import inlineBlockKeybindFactory from "../factories/inlineBlockKeybindFactory";
import inlineBlockRegexFactory from "../factories/inlineBlockRegexFactory";

const inlineBlocks: Record<string, InlineBlockRenderer> = {
  bold: ({children}) => (
    <strong>{children}</strong>
  ),
}

const Demo: React.FC = () => {
  console.log(
    mergeObject(
      {
        renderers: {
          "text": 2,
        }
      },
      {
        renderers: {
          "red-text": 1,
        }
      }
    )
  )

  return (
    <Editor
      renderers={{
        text: createStyledText({}, '', inlineBlocks),
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
      plugins={[
        createStyledTextPlugin(
          "red-text",
          {
            color: "red",
          },
          "",
          inlineBlocks,
        ),
      ]}
    />
  );
};

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);