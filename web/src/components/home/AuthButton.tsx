/* eslint-disable max-len */
import React from 'react';
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
    authorisationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback/${company.toLowerCase()}`,
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

export default AuthButton;
