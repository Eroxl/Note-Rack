import React, { useRef } from 'react';

interface BlockHandleProps {
  draggableRef: React.LegacyRef<HTMLDivElement>,
}

const BlockHandle = (props: BlockHandleProps) => {
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const { draggableRef } = props;

  return (
    <div className="absolute top-0 w-1 group right-full">
      <div className="absolute top-0 flex flex-col gap-1.5 right-full" ref={menuButtonRef}>
        <div
          ref={draggableRef}
          className={`relative w-6 py-1 rounded fill-current cursor-grab self-end dark:hover:bg-white/10 hover:bg-black/1 text-zinc-800/50 dark:text-amber-50/50`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="opacity-0 group-hover:opacity-100">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BlockHandle;
