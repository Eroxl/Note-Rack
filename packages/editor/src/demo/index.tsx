import React from "react";
import ReactDOM from 'react-dom';

import Editor from "../components/Editor";
import generateUUID from "../lib/helpers/generateUUID";
import blockRenderers from "./blockRenderers";
import richTextKeybinds from "./richTextKeybinds";
import keybinds from "./keybinds";

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
      renderers={blockRenderers}
      // inlineBlockRenderers={{
      //   bold: {
      //     deserializer: (element) => `**${element.innerText}**`,
      //     serializer: (props) => {
      //       const { content } = props;

      //       const boldRegex = /\*\*(.*?)\*\*/g;

      //       return (
      //         <span
      //           style={{
      //             fontWeight: 'bold'
      //           }}
      //         >
      //           {content.replace(boldRegex, '$1')}
      //         </span>
      //       )
      //     }
      //   }
      // }}
      keybinds={keybinds}
      richTextKeybinds={richTextKeybinds}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
