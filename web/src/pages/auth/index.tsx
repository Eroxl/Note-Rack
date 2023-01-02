import React, { useEffect } from 'react';
import SuperTokens, { redirectToAuth } from 'supertokens-auth-react';

import AuthButton from '../../components/home/AuthButton';
import AuthNavBar from '../../components/home/AuthNavBar';

const Auth = () => {
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth();
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center w-screen h-screen bg-amber-50">
      <div className="z-10 w-full max-w-7xl">
        <AuthNavBar />
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
};

export default Auth;
