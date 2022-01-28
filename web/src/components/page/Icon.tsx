import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Icon = (props: { icon: string }) => {
  const { icon } = props;

  return (
    <span role="img" className="text-7xl select-none w-min relative">
      {icon}
      <div className="sm:flex hidden">
        <Picker style={{ position: 'absolute', right: '-133px', top: '110%' }} />
      </div>
      <div className="flex sm:hidden">
        <Picker style={{ position: 'absolute', right: '0%', top: '110%' }} />
      </div>
    </span>
  );
};

export default Icon;
