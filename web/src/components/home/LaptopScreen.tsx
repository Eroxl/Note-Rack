import React from 'react';

interface LaptopScreenProps {
  children: React.ReactNode,
}

const LaptopScreen = (props: LaptopScreenProps) => {
  const { children } = props;

  return (
    <div className="relative flex border-[6px] rounded-lg border-zinc-400 drop-shadow-md h-min">
      <div className="absolute -top-1 -bottom-1 -left-1 -right-1 bg-black border-black rounded-lg border-[6px] -z-10" />
      {children}
    </div>
  );
};

export default LaptopScreen;
