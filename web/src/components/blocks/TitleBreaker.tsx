import React from 'react';

// print:bg-black/0 print:dark:bg-white/0 print:dark:bg-black/5 relative print:overflow-hidden print:before:absolute print:before:border-[999px] print:before:-m-3 print:before:border-black/5
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
