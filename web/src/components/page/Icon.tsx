import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Icon = (props: { icon: string }) => {
  const { icon } = props;
  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(icon);

  const emojiPickerMenuRef = useRef<HTMLDivElement>(null);

  const onEmojiChange = (emoji: any) => {
    setCurrentIcon(emoji.native);
    setIsEmojiSelectorActive(false);
  };

  useEffect(() => {
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
      <span className="select-none w-20 h-20 hover:bg-slate-600 hover:bg-opacity-5 flex justify-center items-center">
        <button className="text-7xl select-none w-min h-min" type="button" onClick={() => { setIsEmojiSelectorActive(!isEmojiSelectorActive); }}>
          {currentIcon}
        </button>
      </span>
      <div className={`absolute sm:right-[-133px] right-[0%] top-[110%] ${isEmojiSelectorActive || 'hidden'}`}>
        <Picker onSelect={onEmojiChange} />
      </div>
    </div>
  );
};

export default Icon;
