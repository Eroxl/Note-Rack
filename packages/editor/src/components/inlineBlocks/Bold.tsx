import React from "react";

import type InlineBlockRenderer from "src/types/InlineBlockRenderer";

const Bold: InlineBlockRenderer = (props) => {
  const { content } = props;

  return (
    <span
      style={{
        fontWeight: 'bold'
      }}
    >
      {content}
    </span>
  )
};

export default Bold;
