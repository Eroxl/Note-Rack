import React from "react";
import ReactDOM from 'react-dom';

import Editor from "../components/Editor";
import generateUUID from "../lib/helpers/generateUUID";
import blockRenderers from "./blockRenderers";
import richTextKeybinds from "./richTextKeybinds";

const Demo: React.FC = () => {
  return (
    <Editor
      startingBlocks={[
        {
          id: generateUUID(),
          type: 'h1',
          properties: {
            text: 'Heading 1',
          }
        },
      ]}
      renderers={blockRenderers}
      richTextKeybinds={richTextKeybinds}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
