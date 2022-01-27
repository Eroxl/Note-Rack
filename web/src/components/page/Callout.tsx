import React from 'react';

const Icon = (props: { text: string }) => {
  const { text } = props;

  return (
    <div className="w-full h-max bg-black bg-opacity-5 rounded-md px-5 py-2">
      <h1 className="text-base opacity-100">{text}</h1>
    </div>
  );
};

export default Icon;
