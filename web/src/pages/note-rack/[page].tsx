import React from 'react';

const NoteRack = () => (
  <div className="h-screen w-screen overflow-hidden bg-amber-50">
    <div className="absolute w-screen h-10 bg-amber-50 z-10" />
    <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />
    <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
      <div className="h-max w-full bg-amber-50 flex flex-col items-center">
        <div className="bg-blue-300 h-72 w-full -mb-10" />
        <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24 editor" />
      </div>
    </div>
  </div>
);

export default NoteRack;
