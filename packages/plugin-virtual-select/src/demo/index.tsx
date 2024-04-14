import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "@note-rack/editor";
import createStyledTextRenderer from "@note-rack/plugin-styled-text";
import { Selectable } from "react-virtual-selection";
import createWrapper from "../components/createWrapper";

const Demo: React.FC = () => (
  <Selectable
    accepts="selectableBlock"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      
      overflow: 'hidden',
    }}
    selectionStyle={{
      backgroundColor: "blue",
    }}
  >
    <Editor
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
      blockWrappers={[
        createWrapper({
          backgroundColor: 'blue'
        })
      ]}
    />
  </Selectable>
);

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);
