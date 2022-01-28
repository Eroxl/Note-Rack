import React, { useState, useEffect, useRef } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Icon = (props: { icon: string }) => {
  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);
  const { icon } = props;
  const emojiPickerMenuRef = useRef<HTMLDivElement>(null);

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
    <span
      className="text-7xl select-none w-min relative"
      ref={emojiPickerMenuRef}
    >
      <button type="button" onClick={() => { setIsEmojiSelectorActive(!isEmojiSelectorActive); }}>
        {icon}
      </button>
      <div className={`absolute sm:right-[-133px] right-[0%] top-[110%] ${isEmojiSelectorActive || 'hidden'}`}>
        <Picker />
      </div>
    </span>
  );
};

export default Icon;
