import React from "react";
import ReactDOM from 'react-dom';

import createStyledText from "../components/extendable/createStyledText";
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
        text: createStyledText({
          color: 'red',
          fontSize: '2em',
          fontWeight: 'bold'
        })
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
