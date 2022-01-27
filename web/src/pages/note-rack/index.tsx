import React from 'react';

const NoteRack = () => (
  <div className="h-screen w-screen overflow-hidden bg-amber-50">
    <div className="absolute w-screen h-10 bg-amber-50 z-10" />
    <div className="absolute h-screen w-52 bg-amber-400 opacity-10" />
    <div className="pl-52 h-full w-full overflow-scroll mt-10 no-scrollbar">
      <div className="h-max w-full bg-amber-50 flex flex-col items-center">
        <div className="bg-blue-300 h-72 w-full -mb-10" />
        <div className="max-w-4xl w-full text-zinc-700 break-words h-max px-20 flex flex-col gap-3 pb-24">
          <h1 className="text-7xl select-none -ml-10">🪐</h1>
          <h1 className="text-5xl font-bold">Project - Extra-Terrestre</h1>
          <div className="w-full h-0.5 bg-black opacity-5 rounded-md" />
          <h1 className="text-4xl font-bold">Test H1</h1>
          <h1 className="text-3xl font-bold">Test H2</h1>
          <h1 className="text-2xl font-bold">Test H3</h1>
          <h1 className="text-xl font-bold">Test H4</h1>
          <h1 className="text-lg font-bold">Test H5</h1>
          <h1 className="text-base font-bold">Test Bold</h1>
          <h1 className="text-base">Test Text</h1>
          <h1 className="text-base font-bold underline">Test Bold Underline</h1>
          <h1 className="text-base underline">Test Text Underline</h1>
          <div className="w-full h-2 bg-zinc-700 rounded-md" />
          <div className="w-full h-max bg-black bg-opacity-5 rounded-md px-5 py-2">
            <h1 className="text-base opacity-100">Test Callout</h1>
          </div>
          <h1 className="text-base opacity-100 before:bg-yellow-100 border-l-4 border-zinc-700 pl-2">Test Quote</h1>
          <ul className="list-decimal list-inside">
            <li>Test Ordered List</li>
            <li>Test Ordered List</li>
          </ul>
          <ul className="list-disc list-inside">
            <li>Test Unordered List</li>
            <li>Test Unordered List</li>
          </ul>
          <ul>
            <li>
              <input type="checkbox" />
              {' '}
              Test checklist
            </li>
            <li>
              <input type="checkbox" />
              {' '}
              Test checklist
            </li>
          </ul>
          <button className="text-base opacity-100 font-bold w-max" type="button">[ 🧪 Test Page ]</button>
          <button className="text-base opacity-100 font-bold w-max" type="button">[ Test Page (without icon) ]</button>
        </div>
      </div>
    </div>
  </div>
);

export default NoteRack;
