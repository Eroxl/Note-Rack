import React from "react";
import ReactDOM from 'react-dom';
import { Editor } from "@note-rack/editor";
import mergeObject from "@note-rack/editor/lib/helpers/mergeObjects";

import createStyledTextPlugin from "../createStyledTextPlugin";
import createStyledText from "../createStyledText";
import InlineBlockRenderer from "../types/InlineBlockRenderer";

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