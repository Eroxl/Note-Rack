import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createStyledText from "../createStyledTextRenderer";
import inlineBlockKeybindFactory from "../factories/inlineBlockKeybindFactory";
import inlineBlockRegexFactory from "../factories/inlineBlockRegexFactory";
import InlineBlockRenderer from "../types/InlineBlockRenderer";

const inlineBlocks: Record<string, InlineBlockRenderer<Record<string, unknown>>> = {
  bold: ({ children }) => (
    <strong>{children}</strong>
  ),
  italic: ({children}) => (
    <i>{children}</i>
  ),
  link: ({ properties, children }) => {
    const componentRef = useRef<HTMLAnchorElement>(null);
    const [currentProps, setCurrentProps] = useState<Record<string, unknown> | undefined>(properties);

    useEffect(() => {
      setCurrentProps(properties);
    });

    useEffect(() => {
      if (!componentRef.current?.parentElement?.dataset) return;

      componentRef.current.parentElement.dataset.props = JSON.stringify(currentProps);
    }, [currentProps]);

    return (
      <a
        contentEditable={false}
        ref={componentRef}
        href={currentProps?.href as string}
      >
        {children}
      </a>
    )
  }
};

const Demo: React.FC = () => (
  <Editor
    renderers={{
      text: createStyledText({}, '', inlineBlocks),
      'red-text': createStyledText({color: 'red'}, '', inlineBlocks),
    }}
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
          text: 'Bold text test.com and more text',
          style: [
            {
              type: ['bold'],
              start: 0,
              end: 4,
            },
            {
              type: ['link'],
              properties: [
                {
                  href: 'https://test.com'
                }
              ],
              start: 10,
              end: 18,
            }
          ]
        }
      },
    ]}
    keybinds={[
      {
        handler: inlineBlockKeybindFactory('bold', ['italic', 'bold', 'link']),
        keybind: 'Meta+b',
      },
      {
        handler: inlineBlockKeybindFactory('italic', ['italic', 'bold', 'link']),
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
          ['italic', 'bold', 'link']
        ),
      },
      {
        regex: /(\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory(
          'italic',
          ['italic', 'bold', 'link']
        )
      },
      {
        regex: /()(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&\/=]*) \1/g,
        handler: inlineBlockRegexFactory('link', ['bold', 'italic']),
      }
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);