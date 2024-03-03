import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import type InlineBlockRenderer from '@note-rack/plugin-styled-text/types/InlineBlockRenderer';

import createAutocompleteTextRenderer from "../createAutocompleteTextRenderer";

const autcomplete: InlineBlockRenderer = ({children}) => (
  <span
    contentEditable={false}
    style={{
      color: 'lightgray',
    }}
  >
    {children}
  </span>
)

const Demo: React.FC = () => (
  <Editor
    renderers={{
      text: createAutocompleteTextRenderer(() => Promise.resolve(Math.random().toString()), autcomplete, {}, '', {}),
    }}
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
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);