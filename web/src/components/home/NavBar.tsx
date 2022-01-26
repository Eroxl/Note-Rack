import React from 'react';

const NavBar = () => (
  <div className="w-full h-20 border-b-2 border-zinc-700 grid grid-flow-col px-4 pt-2 text-zinc-700">
    <div className="flex flex-row">
      <a href="/#" className="my-auto font-semibold text-3xl flex flex-row align-center">
        <i className="emoji text-5xl bg-[url('https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@13.1.0/color/svg/1F4DD.svg')]" />
        <h1 className="my-auto">Note Rack</h1>
      </a>
    </div>
    <div className="flex flex-row-reverse">
      <a href="/login#" className="text-amber-50 my-auto font-semibold text-xl bg-red-400 px-5 py-2 rounded">Login</a>
    </div>
  </div>
);

export default NavBar;
