import React from 'react';
import InlineBlockRenderer from '@note-rack/plugin-styled-text/types/InlineBlockRenderer';

const createInlineLinkRenderer = (): InlineBlockRenderer => {
  return (props) => {
    const { children } = props;

    return (
      <div>
        Link
      </div>
    )
  }
};
