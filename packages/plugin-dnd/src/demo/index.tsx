import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import createStyledTextRenderer from "@note-rack/plugin-styled-text";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import createDnDPlugin from "../createDnDPlugin";

const wrapperStyle = {
  default: {
    position: "relative",
    borderBottom: "2px solid transparent",
  },
  hovered: {
    borderBottom: "2px solid #1E40AF",
  },
} as const;

const handleIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="opacity-0 group-hover:opacity-100">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const handleStyle = {
  position: "absolute",
  height: "1.5rem",
  width: "1.5rem",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  display: "flex",
  right: "calc(100% + 0.5rem)",
} as const;

const dndPlugin = createDnDPlugin(
  {
    style: wrapperStyle.default,
    hoveredStyle: wrapperStyle.hovered,
  },
  handleIcon,
  {
    style: handleStyle,
  }
)

const Demo: React.FC = () => (
  <div
    style={{
      paddingLeft: "3rem",
    }}
  >
    <DndProvider backend={HTML5Backend}>
      <Editor
        plugins={[dndPlugin]}
        renderers={{
          text: createStyledTextRenderer({
            minHeight: "1.2em",
            outline: "none",
            position: "relative",
            whiteSpace: "pre-wrap",
            width: "100%",
            display: "block",
            padding: "6px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }),
        }}
        inlineBlocks={{}}
        startingBlocks={[
          {
            id: "1",
            type: "text",
            properties: {
              text: "First Block",
            }
          }, 
          {
            id: "2",
            type: "text",
            properties: {
              text: "Second Block",
            }
          },
          {
            id: "3",
            type: "text",
            properties: {
              text: "Third Block",
            },
          }
        ]}
      />
    </DndProvider>
  </div>
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);
