import React from "react";

import createStyledText from "../components/blocks/createStyledText";

const blockRenderers = {
  text: createStyledText({}, '', {
    bold: ({children}) => (
      <strong>{children}</strong>
    ),
    italic: ({children}) => (
      <em>{children}</em>
    ),
    underline: ({children}) => (
      <u>{children}</u>
    ),
  }),
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
}

export default blockRenderers;
