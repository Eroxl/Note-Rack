import React from "react";
import ReactDOM from 'react-dom';

import createStyledText from "../components/extendable/createStyledText";
import Editor from "../components/Editor";
import generateUUID from "../helpers/generateUUID";
import focusElement from "../helpers/focusElement";

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
      renderers={{
        text: createStyledText(),
        h1: createStyledText({
          fontSize: '2em',
          fontWeight: 'bold'
        }),
        h2: createStyledText({
          fontSize: '1.5em',
          fontWeight: 'bold'
        }),
        h3: createStyledText({
          fontSize: '1.17em',
          fontWeight: 'bold'
        }),
        h4: createStyledText({
          fontSize: '1em',
          fontWeight: 'bold'
        }),
        h5: createStyledText({
          fontSize: '0.83em',
          fontWeight: 'bold'
        }),
      }}
      richTextKeybinds={[
        {
          regex:  /^# (.*)/g,
          handler: (mutations, block, searchResult) => {
            mutations.editBlock(
              block.id,
              {
                text: searchResult[1],
              },
              'h1'
            )
          }
        }
      ]}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
