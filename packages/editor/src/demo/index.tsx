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
        {
          id: generateUUID(),
          type: 'h2',
          properties: {
            text: 'Heading 2',
          }
        },
        {
          id: generateUUID(),
          type: 'h3',
          properties: {
            text: 'Heading 3',
          }
        },
        {
          id: generateUUID(),
          type: 'h4',
          properties: {
            text: 'Heading 4',
          }
        },
        {
          id: generateUUID(),
          type: 'h5',
          properties: {
            text: 'Heading 5',
          }
        },
        {
          id: generateUUID(),
          type: 'text',
          properties: {
            text: 'This is a paragraph.'
          }
        }
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
      postMutations={{
        editBlock: [
          (_, id, properties) => {
            console.log(`Editing block ${id} with properties:`, properties);
          }
        ],
        addBlock: [
          (_, block) => {
            // ~ Focus the new block
            setTimeout(() => {
              const newBlock = document.getElementById(`block-${block.id}`)?.firstChild as (HTMLElement | undefined);

              if (!newBlock) return;

              newBlock.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
              });

              focusElement(newBlock);
            }, 0);
          }
        ]
      }}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
