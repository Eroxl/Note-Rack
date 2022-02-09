import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart';

import { updateServer } from '../../lib/pageController';
import type { PermanentBlock } from '../../lib/types/blockTypes';

const Icon = (
  props: PermanentBlock,
) => {
  const { properties, page, blockID } = props;
  const { value: icon } = properties;

  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(icon);

  const emojiPickerMenuRef = useRef<HTMLDivElement>(null);

  const updateData = (updatedIcon: string) => {
    updateServer(blockID, undefined, { value: updatedIcon }, undefined, page);
  };

  const onEmojiChange = (emoji: BaseEmoji) => {
    setCurrentIcon(emoji.native);
    setIsEmojiSelectorActive(false);

    updateData(emoji.native);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleClickOutside(event: any) {
      if (emojiPickerMenuRef.current && !emojiPickerMenuRef.current.contains(event.target)) {
        setIsEmojiSelectorActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiPickerMenuRef]);

  return (
    <div className="relative w-min h-min" ref={emojiPickerMenuRef}>
      <span className="select-none w-20 h-20 hover:bg-slate-600 hover:bg-opacity-5 flex justify-center items-center rounded">
        <button className="text-7xl select-none w-min h-min" type="button" onClick={() => { setIsEmojiSelectorActive(!isEmojiSelectorActive); }}>
          {currentIcon}
        </button>
      </span>
      <div className={`absolute sm:right-[-133px] right-[0%] top-[110%] z-10 ${isEmojiSelectorActive || 'hidden'}`}>
        <Picker onSelect={onEmojiChange} recent={['']} />
      </div>
    </div>
  );
};

export default Icon;
