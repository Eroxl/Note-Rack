import React from 'react';

const TitleBreaker = () => (
  <div className="
    w-full h-0.5 bg-black opacity-5 rounded-md
    print:bg-opacity-0
    print:relative print:overflow-hidden
    print:before:border-[999px]
    print:before:border-black
  "
  />
);

export default TitleBreaker;
