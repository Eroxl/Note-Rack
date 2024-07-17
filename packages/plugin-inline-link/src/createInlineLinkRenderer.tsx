import React, { useEffect, useRef, useState } from 'react';
import InlineBlockRenderer from '@note-rack/plugin-styled-text/types/InlineBlockRenderer';

type InlineLinkProps = {
  href: string,
}

const createInlineLinkRenderer = (): InlineBlockRenderer<InlineLinkProps> => {
  return ({ properties, children }) => {
    const componentRef = useRef<HTMLAnchorElement>(null);
    const [currentProps, setCurrentProps] = useState<InlineLinkProps>(properties);

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
        href={currentProps.href}
      >
        {children}
      </a>
    )
  }
};

export default createInlineLinkRenderer;
