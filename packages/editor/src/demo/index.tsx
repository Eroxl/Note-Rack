import React from "react";
import ReactDOM from 'react-dom';

import createStyledText from "../components/extendable/createStyledText";
import Editor from "../components/Editor";
import generateUUID from "src/helpers/generateUUID";

const Demo: React.FC = () => {
  return (
    <Editor
      startingBlocks={[
        {
          id: generateUUID(),
          type: "text",
          properties: {
            text: "Hello, world!"
          }
        },
        {
          id: generateUUID(),
          type: "h1",
          properties: {
            text: "Heading 1",
          }
        },
      ]}
      renderers={{
        text: createStyledText(),
        h1: createStyledText({
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
