import React, { useState, useEffect, useRef, useContext } from 'react';

import ColourPicker from './ColoursPicker';
import PageContext from '../../contexts/PageContext';

interface PageThumbnailProps {
  colour: {
    r: number;
    g: number;
    b: number;
  },
  page: string,
}

const PageThumbnail = (props: PageThumbnailProps) => {
  const { colour, page } = props;
  const colourMenuActiveRef = useRef<HTMLDivElement>(null);
  const [isColourMenuActive, setIsColourMenuActive] = useState(false);
  const [activeColour, setActiveColour] = useState({});

  const { pageData } = useContext(PageContext);

  const isAllowedToEdit = pageData?.userPermissions.admin;

  useEffect(() => {
    setActiveColour({
      '--forced-background-colour': `#${colour.r.toString(16).padStart(2, '0')}${colour.g.toString(16).padStart(2, '0')}${colour.b.toString(16).padStart(2, '0')}`,
    });
  }, [colour]);

  useEffect(() => {
    const handleClickOutside = (event: unknown) => {
      if (
        colourMenuActiveRef.current && !colourMenuActiveRef.current.contains(
          (event as React.MouseEvent<HTMLElement>).target as Node,
        )
      ) {
        setIsColourMenuActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colourMenuActiveRef]);

  return (
    <div className="w-full p-4 -mb-10 overflow-visible print:overflow-hidden h-72 print:h-56 print-forced-background group" style={activeColour as Record<string, unknown>}>
      <div className="flex items-end justify-end w-full h-full max-w-4xl gap-2 mx-auto print:hidden">
        <div ref={colourMenuActiveRef} className="relative">
          {isAllowedToEdit && (
            <button
              className={`px-2 py-1 text-xs transition-opacity duration-300 ease-in-out rounded w-28 text-zinc-700/80 dark:text-amber-50/80 bg-amber-50 dark:bg-zinc-700 group-hover:opacity-100 ${isColourMenuActive || 'opacity-0'}`}
              type="button"
              onClick={() => { setIsColourMenuActive(!isColourMenuActive); }}
            >
              Change Colour
            </button>
          )}
          <div className={`absolute -right-0 top-[31px] z-20 print:hidden ${isColourMenuActive || 'hidden'}`}>
            <ColourPicker
              page={page}
              setActiveColour={setActiveColour}
              setIsColourMenuActive={setIsColourMenuActive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageThumbnail;
