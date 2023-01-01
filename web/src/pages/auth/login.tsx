/* eslint-disable max-len */
import React from 'react';
import Link from 'next/link';
import {
  getAuthorisationURLWithQueryParamsAndSetState,
} from 'supertokens-auth-react/recipe/thirdparty';

const authButtonClicked = async (company: string) => {
  // -=- Verification -=-
  // ~ If the company is not Github, Google or Apple, then return.
  if (!(company === 'Github' || company === 'Google' || company === 'Apple')) {
    return;
  }

  const authURL = await getAuthorisationURLWithQueryParamsAndSetState({
    providerId: company.toLowerCase(),
    authorisationURL: `http://127.0.0.1:3000/auth/callback/${company.toLowerCase()}`,
  });

  window.location
    .assign(authURL);
};

const AuthButton = (props: { company: string }) => {
  const { company } = props;

  return (
    <button
      type="submit"
      className="w-full px-5 py-2 text-xl bg-white border-2 rounded-md shadow text-zinc-700 border-zinc-700"
      onClick={() => authButtonClicked(company)}
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
    <div className="flex flex-col items-center justify-center h-2/3">
      {/* Sign Up / Sign In Providers */}
      <div className="flex flex-col p-5 border-2 rounded-md sm:p-10 border-zinc-700">
        <div className="z-10 flex flex-col items-center gap-5 w-96">
          <div className="text-4xl font-semibold text-zinc-700">
            Sign Up / Sign In
          </div>

          <div className="w-full h-1 rounded-full bg-zinc-700" />

          <AuthButton company="Github" />
          <AuthButton company="Google" />
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
