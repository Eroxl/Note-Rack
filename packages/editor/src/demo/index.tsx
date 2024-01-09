import React from "react";
import ReactDOM from 'react-dom';

import Editor from "../components/Editor";
import generateUUID from "../lib/helpers/generateUUID";
import blockRenderers from "./blockRenderers";
import richTextKeybinds from "./richTextKeybinds";
import keybinds from "./keybinds";

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
            text: 'Normal plaintext'
          }
        }
      ]}
      renderers={blockRenderers}
      keybinds={keybinds}
      richTextKeybinds={richTextKeybinds}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
