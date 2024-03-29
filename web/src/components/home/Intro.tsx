import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

import LaptopScreen from './LaptopScreen';

const Intro = () => (
  <div className="mt-12">
    <p
      className="flex flex-col items-center m-8 mx-auto text-6xl font-bold text-center"
    >
      Organize your academic life,
      <p className="w-min">
        effortlessly.
        <svg
          className="w-full"
          width="406"
          height="15"
          viewBox="0 0 406 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 2C141.997 6.41791 277.923 17.7194 403.975 10.9783ZM2 2C141.795 6.08602 278.504 16.0584 403.975 10.9783ZM2.369 6.8907C132.115 2.00313 261.241 7.51535 404.134 5.09504ZM2.369 6.8907C131.488 4.11346 262.21 8.11807 404.134 5.09504Z" stroke="#E77A75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>
    </p>

    <div>
      <p className="m-8 text-2xl font-bold text-center">
        Streamline your study routine with Note Rack: the unified
        <br />
        hub for all your notes and tasks.
      </p>
    </div>

    <div className="flex flex-col items-center justify-center m-8 transition-all duration-75">
      <Link href="/auth#">
        <a
          href="/auth#"
          className="px-12 py-2 text-xl font-semibold bg-red-400 rounded shadow-under text-amber-50 shadow-slate-300 active:shadow-none active:translate-x-[0.15rem] active:translate-y-[0.15rem]"
        >
          Join now!
        </a>
      </Link>
    </div>

    <div className="max-w-4xl mx-auto my-20">
      <LaptopScreen>
        <img
          src="/promo/Notes-Example.png"
          alt="Note Rack Example"
          className="rounded-md"
        />
      </LaptopScreen>
    </div>
  </div>
);

export default Intro;
