import React from "react";
import ReactDOM from 'react-dom';

import Editor from "../components/Editor";
import generateUUID from "../lib/helpers/generateUUID";
import blockRenderers from "./blockRenderers";
import richTextKeybinds from "./richTextKeybinds";
import keybinds from "./keybinds";
import Plugin from '../types/Plugin';

const bluePlugin: Plugin = {
  blockWrappers: [
    ({ block, children}) => {
      return (
        <div
          style={{
            color: (block.properties.text as string).toLowerCase().includes('blue') ? 'blue' : 'black',
            padding: '5px',
            margin: '5px',
          }}
        >
          {children}
        </div>
      );
    }
  ]
};

const Demo: React.FC = () => {
  return (
    <Editor
      startingBlocks={[
        {
          id: generateUUID(),
          type: 'text',
          properties: {
            text: 'Bold, italic, and underlined text',
            style: [
              {
                type: ['bold'],
                start: 0,
                end: 4,
              },
              {
                type: ['italic'],
                start: 6,
                end: 12,
              },
              {
                type: ['underline'],
                start: 18,
                end: 28,
              },
            ]
          }
        },
        {
          id: generateUUID(),
          type: 'text',
          properties: {
            text: 'Normal plain-text'
          }
        },
        {
          id: generateUUID(),
          type: 'text',
          properties: {
            text: 'Blue wrapped text',
          }
        }
      ]}
      renderers={blockRenderers}
      keybinds={keybinds}
      richTextKeybinds={richTextKeybinds}

      plugins={[
        bluePlugin
      ]}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
