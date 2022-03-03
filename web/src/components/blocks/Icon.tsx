import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart';

import updateServer from '../../lib/updateServer';
import type { PermanentBlock } from '../../types/blockTypes';

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
    function handleClickOutside(event: unknown) {
      if (
        emojiPickerMenuRef.current && !emojiPickerMenuRef.current.contains(
          (event as React.MouseEvent<HTMLElement>).target as Node,
        )
      ) {
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
      <span className="flex items-center justify-center w-20 h-20 rounded select-none print:w-40 print:justify-start hover:bg-slate-600/5 hover:dark:bg-amber-50/5">
        <button className="select-none text-7xl w-min h-min print:hidden" type="button" onClick={() => { setIsEmojiSelectorActive(!isEmojiSelectorActive); }}>
          {currentIcon}
        </button>
      </span>
      <div className={`absolute sm:right-[-133px] right-[0%] top-[110%] z-10 ${isEmojiSelectorActive || 'hidden'}`}>
        <Picker onSelect={onEmojiChange} recent={['']} native />
      </div>
    </div>
  );
};

export default Icon;
