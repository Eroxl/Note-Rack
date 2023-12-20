import React from "react";
import ReactDOM from 'react-dom';

import Text from "../components/Text";
import Editor from "../components/Editor";

const Demo: React.FC = () => {
  return (
    <Editor
      startingBlocks={[
        {
          id: "1",
          type: "text",
          properties: {
            text: "Hello, world!"
          }
        },
      ]}
      renderers={{
        text: Text
      }}
      postMutations={{
        editBlock: [
          (_, id, properties) => {
            console.log(`Editing block ${id} with properties:`, properties);
          }
        ]
      }}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
