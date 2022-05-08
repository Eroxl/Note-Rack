import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, BaseEmoji } from 'emoji-mart';

import type { PermanentBlock } from '../../types/blockTypes';
import editStyle from '../../lib/pages/editStyle';

interface IconProps extends PermanentBlock {
  icon: string,
}

const Icon = (props: IconProps) => {
  const { page, icon } = props;

  const [currentIcon, setCurrentIcon] = useState(icon || '📝');
  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);

  const emojiPickerMenuRef = useRef<HTMLDivElement>(null);

  const onEmojiChange = (emoji: BaseEmoji) => {
    setCurrentIcon(emoji.native);
    setIsEmojiSelectorActive(false);

    editStyle({ icon: emoji.native }, page);
    document.dispatchEvent(new CustomEvent('changePageTitle', { detail: { newIcon: emoji.native } }));
  };

  useEffect(() => {
    setCurrentIcon(icon);
  }, [icon]);

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
