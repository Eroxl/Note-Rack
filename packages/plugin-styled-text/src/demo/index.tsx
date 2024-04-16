import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createStyledText from "../createStyledTextRenderer";
import inlineBlockKeybindFactory from "../factories/inlineBlockKeybindFactory";
import inlineBlockRegexFactory from "../factories/inlineBlockRegexFactory";
import InlineBlockSchema from "../types/InlineBlockSchema";

const inlineBlocks = {
  bold: {
    acceptsChildren: true,
    renderer: ({ children }) => (
      <strong>{children}</strong>
    ),
  },
  link: {
    acceptsChildren: false,
    renderer: ({ properties }) => {
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
          href="https://test.com"
          contentEditable={false}
          ref={componentRef}
        >
          {currentProps?.href as string}
        </a>
      )
    }
  }
} satisfies Record<string, InlineBlockSchema>

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
          text: 'Bold text and more text',
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
                  href: 'test.com'
                }
              ],
              start: 10,
              end: 10,
            }
          ]
        }
      },
    ]}
    keybinds={[
      {
        handler: inlineBlockKeybindFactory('bold'),
        keybind: 'Meta+b',
      },
    ]}
    richTextKeybinds={[
      {
        regex: /^red (.*)/g,
        handler: blockRegexFactory('red-text'),
      },
      {
        regex: /(\*\*)(.*?)\1/g,
        handler: inlineBlockRegexFactory('bold'),
      },
      {
        regex: /()(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&\/=]*) \1/g,
        handler: inlineBlockRegexFactory('link'),
      }
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);