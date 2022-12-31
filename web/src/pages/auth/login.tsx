/* eslint-disable max-len */
import React from 'react';
import Link from 'next/link';

const AuthButton = (props: { company: string }) => {
  const { company } = props;

  return (
    <button
      type="submit"
      className="w-full px-5 py-2 text-xl bg-white border-2 rounded-md shadow text-zinc-700 border-zinc-700"
    >
      <div className="flex flex-row w-3/4 mx-auto">
        <img
          src={`/logos/${company.toLowerCase()}.svg`}
          alt="Github Logo"
          className="w-auto h-6 my-auto mr-4"
        />
        <p className="mx-auto">
          Continue with
          {' '}
          {company}
        </p>
      </div>
    </button>
  );
};

const LoginPage = () => (
  <div className="relative flex flex-col items-center w-screen h-screen bg-amber-50">
    <div className="z-10 w-full max-w-7xl">
      <div className="grid w-full h-20 grid-flow-col px-4 pt-2 border-b-2 border-zinc-700 text-zinc-700">
        <Link href="/#">
          <a href="/#" className="flex flex-row my-auto text-3xl font-semibold align-center">
            <i className="emoji text-5xl bg-[url('https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@13.1.0/color/svg/1F4DD.svg')]" />
            <h1 className="my-auto">Note Rack</h1>
          </a>
        </Link>
      </div>
    </div>
    {/* Login / Signup Page */}
    <div className="flex flex-col items-center justify-around h-full">
      {/* Background Blobs */}
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute fill-red-400 -translate-x-[28rem] md:inline-block hidden w-[32rem]">
        <path d="M30.8,-47.3C43.4,-46.1,59.5,-44.9,64.7,-37C69.9,-29.1,64.2,-14.6,59.9,-2.5C55.6,9.6,52.7,19.2,50.5,32.2C48.3,45.3,46.8,61.8,38.5,70.1C30.2,78.4,15.1,78.4,1.8,75.3C-11.5,72.2,-23,66,-29.6,56.8C-36.2,47.5,-37.8,35.1,-46.9,25.2C-55.9,15.2,-72.3,7.6,-74.6,-1.4C-77,-10.4,-65.4,-20.7,-57.4,-32.4C-49.4,-44.1,-44.9,-57.1,-36,-60.4C-27,-63.7,-13.5,-57.3,-2.2,-53.5C9.1,-49.7,18.2,-48.5,30.8,-47.3Z" transform="translate(100 100)" />
      </svg>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute fill-red-400 translate-x-[28rem] md:inline-block hidden w-[32rem]">
        <path d="M24,-46.7C32.7,-36.5,42.5,-33.3,46.4,-26.7C50.2,-20.1,48.1,-10.1,51,1.7C53.9,13.4,61.7,26.8,61.4,39.5C61,52.2,52.5,64.2,40.9,66.5C29.4,68.7,14.7,61.1,1.5,58.5C-11.7,56,-23.4,58.3,-34.3,55.7C-45.3,53.1,-55.6,45.6,-65.5,35.5C-75.3,25.4,-84.7,12.7,-83.5,0.7C-82.3,-11.3,-70.5,-22.6,-62.6,-36.2C-54.8,-49.8,-50.9,-65.7,-41.2,-75.3C-31.4,-84.9,-15.7,-88.3,-4,-81.3C7.6,-74.3,15.2,-56.9,24,-46.7Z" transform="translate(100 100)" />
      </svg>

      {/* Sign Up / Sign In Providers */}
      <div className="z-10 flex flex-col items-center justify-start gap-5 w-96">
        <div className="text-4xl font-semibold text-zinc-700">
          Sign Up / Sign In
        </div>

        <div className="w-full h-1 rounded-full bg-zinc-700" />

        <AuthButton company="Github" />
        <AuthButton company="Google" />
        <AuthButton company="Apple" />
      </div>
    </div>
  </div>
);

export default LoginPage;
