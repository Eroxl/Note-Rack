import React from 'react';

const NoteRack = () => (
  <div className="h-screen w-screen overflow-hidden bg-amber-50">
    <div className="absolute w-screen h-10 bg-amber-50 z-10" />
    <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />
    <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
      <div className="h-max w-full bg-amber-50 flex flex-col items-center">
      </div>
    </div>
  </div>
);

export default NoteRack;
