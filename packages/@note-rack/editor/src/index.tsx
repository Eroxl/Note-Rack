import React from 'react';
import ReactDOM from 'react-dom';

import Editor from './components/Editor';
import createTextBlock from './components/blocks/createTextBlock/createTextBlock';
import generateID from './helpers/generateID';

const blockTypes = {
  '*': {
    component: createTextBlock(),
  },
  'h1': {
    component: createTextBlock('', {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
      fontWeight: 'bold',
    }),
  }
}

ReactDOM.render(
  <Editor
    blockTypes={blockTypes}
    data={[
      {
        blockType: 'h1',
        _id: generateID(),
        properties: {
          text: 'Heading 1',
        },
      },
      {
        blockType: '*',
        _id: generateID(),
        properties: {
          text: 'Text',
        },
      },
    ]}
    onChange={(data) => {
      console.log(data);
    }}
  />,
  document.getElementById('root')
);
