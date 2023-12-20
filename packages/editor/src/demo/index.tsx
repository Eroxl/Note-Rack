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
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
