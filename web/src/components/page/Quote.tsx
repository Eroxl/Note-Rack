import React from 'react';

const Icon = (props: { text: string }) => {
  const { text } = props;

  return (
    <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24">
      <h1 className="text-base opacity-100 border-l-4 border-zinc-700 pl-2">{text}</h1>
    </div>
  );
};

export default Icon;
