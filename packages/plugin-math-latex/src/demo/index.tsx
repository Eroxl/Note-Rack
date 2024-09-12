import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import blockRegexFactory from "@note-rack/editor/lib/factories/blockRegexFactory";

import createMathRenderer from '../createMathRenderer';

const Demo: React.FC = () => (
  <Editor
    renderers={{
      math: createMathRenderer(),
      text: ({ properties }) => (
        <p
          contentEditable
          suppressContentEditableWarning
        >
          {properties.text}
        </p>
      )
    }}
    startingBlocks={[
      {
        id: "1",
        type: "math",
        properties: {
          text: "x^2 + y^2 = z^2",
        }
      },
      {
        id: "2",
        type: "math",
        properties: {
          text: `
          \\begin{aligned}
          x &= 2 \\\\
          y &= 3
          \\end{aligned}
          `
        }
      },
    ]}
    inlineBlocks={{}}
    richTextKeybinds={[
      {
        handler: blockRegexFactory("math"),
        regex: /^\$\$ (.*)/g,
      }
    ]}
  />
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);