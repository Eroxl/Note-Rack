import React, { useState } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Icon = (props: { icon: string }) => {
  const [isEmojiSelectorActive, setIsEmojiSelectorActive] = useState(false);
  const { icon } = props;

  return (
    <span role="img" className="text-7xl select-none w-min relative">
      {icon}
      <div className="absolute sm:right-[-133px] right-[0%] top-[110%]">
        <Picker />
      </div>
    </span>
  );
};

export default Icon;
