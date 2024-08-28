import React from "react";
import ReactDOM from "react-dom";

import Editor from '../components/Editor';
import createStyledTextRenderer from "../components/createStyledTextRenderer";
import inlineBlockKeybindFactory from '../lib/factories/inlineBlockKeybindFactory';
import blockRegexFactory from '../lib/factories/blockRegexFactory';
import InlineBlockRenderer from "../types/InlineBlockRenderer";
import inlineBlockRegexFactory from '../lib/factories/inlineBlockRegexFactory';

const inlineBlocks: Record<string, InlineBlockRenderer<Record<string, unknown>>> = {
  bold: ({ children }) => (
    <strong>{children}</strong>
  ),
  italic: ({children}) => (
    <i>{children}</i>
  ),
  'non-editable': ({children}) => (
    <span contentEditable="false">{children}</span>
  )
};

const Demo: React.FC = () => (
  <Editor
    renderers={{
      text: createStyledTextRenderer({}, ''),
      'red-text': createStyledTextRenderer({color: 'red'}, ''),
    }}
    inlineBlocks={inlineBlocks}
    startingBlocks={[
      {
        id: "1",
        type: "red-text",
        properties: {
          text: "Hello, world!",
        },
      },
      {
        id: "2",
        type: "text",
        properties: {
          text: 'Bold text and more text non-editable',
          style: [
            {
              type: ['bold'],
              start: 0,
              end: 4,
            },
            {
              type: ['non-editable'],
              start: 24,
              end: 36, 
            }
          ]
        }
      },
      {
        id: "3",
        type: "text",
        properties: {
          text: 'Bold',
          style: [
            {
              type: ['bold'],
              start: 0,
              end: 4,
            },
          ]
        }
      },
    ]}
    keybinds={[
      {
        handler: inlineBlockKeybindFactory('bold', ['italic', 'bold']),
        keybind: 'Meta+b',
      },
      {
        handler: inlineBlockKeybindFactory('italic', ['italic', 'bold',]),
        keybind: 'Meta+i',
      }
    ]}
    richTextKeybinds={[
      {
        regex: /^red (.*)/g,
        handler: blockRegexFactory('red-text'),
      },
      {
        regex: /(\*\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory(
          'bold',
          ['italic', 'bold']
        ),
      },
      {
        regex: /(\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory(
          'italic',
          ['italic', 'bold']
        )
      },
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);