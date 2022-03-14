import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart';

import { editBlock } from '../../lib/updatePage';
import type { PermanentBlock } from '../../types/blockTypes';

const Icon = (props: PermanentBlock) => {
  const { properties, page, blockID } = props;
  const { value: icon } = properties;

  const [currentIcon, setCurrentIcon] = useState(icon);
  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);

  const emojiPickerMenuRef = useRef<HTMLDivElement>(null);

  const onEmojiChange = (emoji: BaseEmoji) => {
    setCurrentIcon(emoji.native);
    setIsEmojiSelectorActive(false);

    editBlock([blockID], undefined, { value: emoji.native }, page);
  };

  useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
      const { current } = emojiPickerMenuRef;
      if (current && !current.contains(event.target as Node)) {
        setIsEmojiSelectorActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as () => void);
  }, [emojiPickerMenuRef]);

  return (
    <div className="relative w-min h-min" ref={emojiPickerMenuRef}>
      <span className="flex items-center justify-center w-20 h-20 rounded select-none print:w-40 print:justify-start hover:bg-slate-600/5 hover:dark:bg-amber-50/5">
        <button className="select-none text-7xl w-min h-min" type="button" onClick={() => { setIsEmojiSelectorActive(!isEmojiSelectorActive); }}>
          {currentIcon}
        </button>
      </span>
      <div className={`absolute sm:right-[-133px] right-[0%] top-[87px] z-10 ${isEmojiSelectorActive || 'hidden'} print:hidden`}>
        <Picker onSelect={onEmojiChange} recent={['']} native />
      </div>
    </div>
  );
};

export default Icon;
