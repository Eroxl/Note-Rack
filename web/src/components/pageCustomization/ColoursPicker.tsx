import React from 'react';

import editStyle from '../../lib/editStyle';
import Colours from '../../constants/Colours';

interface ColourPickerProps {
  page: string,
  setIsColourMenuActive: (_: boolean) => void,
  setActiveColour: (_: Record<string, unknown>) => void,
}

const ColourPicker = (props: ColourPickerProps) => {
  const {
    setActiveColour,
    setIsColourMenuActive,
    page,
  } = props;

  return (
    <div className="border-black border rounded-md opacity-100 w-80 h-[350px] p-3 text-zinc-700 dark:text-amber-50 bg-stone-100 dark:bg-neutral-600 border-opacity-5 flex flex-col overflow-hidden gap-1">
      <span className="sticky top-0 w-full text-lg font-medium bg-stone-100 dark:bg-neutral-600">
        Colours
      </span>
      <div className="overflow-scroll no-scrollbar">
        {
          Colours.map((colourCategory) => (
            <section className="flex flex-col" key={colourCategory.category}>
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
                        key={formattedHex}
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
  );
};

export default ColourPicker;
