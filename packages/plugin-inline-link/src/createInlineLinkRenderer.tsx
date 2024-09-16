import React, { useEffect, useRef, useState } from 'react';
import InlineBlockRenderer from '@note-rack/editor/types/InlineBlockRenderer';
import { useHover, useFloating, safePolygon, useInteractions } from '@floating-ui/react';
import { createPortal } from 'react-dom';

import type { FloatingLinkEditorProps } from './components/createFloatingLinkEditor';

type InlineLinkProps = {
  href: string,
}

const createInlineLinkRenderer = (
  InlineLinkEditor: React.FC<FloatingLinkEditorProps>,
): InlineBlockRenderer<InlineLinkProps> => {
  return ({ properties, children }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentProps, setCurrentProps] = useState<InlineLinkProps>(properties);

    const componentRef = useRef<HTMLAnchorElement>(null);
    const {
      refs,
      floatingStyles,
      context
    } = useFloating({
      placement: 'bottom-start',
      open: isEditorOpen,
      onOpenChange: setIsEditorOpen,
    });

    const hover = useHover(context, {
      handleClose: safePolygon(),
      delay: {
        open: 350,
        close: 0,
      }
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
    ]);

    useEffect(() => {
      setCurrentProps(properties);
    });

    useEffect(() => {
      if (!componentRef.current?.parentElement?.dataset) return;

      componentRef.current.parentElement.dataset.props = JSON.stringify(currentProps);
    }, [currentProps]);

    useEffect(() => {
      refs.setReference(componentRef.current);
    }, [componentRef.current])

    return (
      <>
        <a
          contentEditable={false}
          ref={componentRef}
          href={currentProps.href}
          {...getReferenceProps}
        >
          {children}
        </a>
        {
          isEditorOpen && document.body && createPortal(
            <InlineLinkEditor
              href={currentProps.href}
              setHref={((href: string) => {
                setCurrentProps((oldProps) => ({
                  ...oldProps,
                  href,
                }))
              }) as React.Dispatch<React.SetStateAction<string>>}
              floatingStyles={floatingStyles}
              setFloating={refs.setFloating}
              {...getFloatingProps}
            />,
            document.body,
          )
        }
      </>
    )
  }
};

export default createInlineLinkRenderer;
