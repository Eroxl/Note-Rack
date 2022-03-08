import React, { useState, useEffect, useRef } from 'react';

import editStyle from '../lib/editStyle';
import Colours from '../constants/Colours';

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

  useEffect(() => {
    setActiveColour({
      '--forced-background-colour': `#${colour.r.toString(16)}${colour.g.toString(16)}${colour.b.toString(16)}`,
    });
  }, []);

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
      <div className="flex items-end justify-end w-full h-full max-w-4xl mx-auto print:hidden">
        <div ref={colourMenuActiveRef} className="relative">
          <button
            className={`px-2 py-1 text-xs transition-opacity duration-300 ease-in-out rounded opacity-0 w-28 text-zinc-700/80 dark:text-amber-50/80 bg-amber-50 dark:bg-zinc-700 group-hover:opacity-100 ${isColourMenuActive && 'opacity-100'}`}
            type="button"
            onClick={() => { setIsColourMenuActive(!isColourMenuActive); }}
          >
            Change Colour
          </button>
          <div className={`absolute -right-0 top-[31px] z-20 print:hidden opacity-100 ${isColourMenuActive || 'hidden'}`}>
            <div className="border-black rounded-md opacity-100 w-80 h-[350px] p-3 text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5 flex flex-col overflow-hidden gap-1">
              <span className="sticky top-0 w-full text-lg font-medium bg-stone-100 dark:bg-neutral-600">
                Colours
              </span>
              <div className="overflow-scroll no-scrollbar">
                {
                  Colours.map((colourCategory) => (
                    <section className="flex flex-col ">
                      <span className="sticky top-0 w-full font-medium bg-stone-100 dark:bg-neutral-600">
                        {colourCategory.category}
                      </span>
                      <div className="flex gap-4">
                        {
                          colourCategory.colours.map((categoryColour) => {
                            const { hex } = categoryColour;
                            const formattedHex = `#${hex}`;
                            const { r, g, b } = categoryColour.colours;

                            const colourStyle = {
                              backgroundColor: formattedHex,
                            };

                            return (
                              <button
                                className="w-1/3 rounded aspect-square"
                                aria-label={`${colourCategory.category} ${hex}`}
                                type="button"
                                style={colourStyle}
                                onClick={() => {
                                  setIsColourMenuActive(false);
                                  setActiveColour({
                                    '--forced-background-colour': formattedHex,
                                  });
                                  editStyle({
                                    colour: {
                                      r,
                                      g,
                                      b,
                                    },
                                  }, page);
                                }}
                              />
                            );
                          })
                        }
                      </div>
                    </section>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// 338px
export default PageThumbnail;
