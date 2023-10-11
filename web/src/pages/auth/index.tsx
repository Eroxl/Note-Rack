import { useRouter } from 'next/router';
import React from 'react';

import AuthButton from '../../components/home/AuthButton';
import AuthNavBar from '../../components/home/AuthNavBar';

const Auth = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="relative flex flex-col items-center w-screen h-screen px-4 mx-auto bg-white max-w-7xl">
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

            {error && (
              <div className="flex flex-row w-full h-full p-2 border-2 border-red-800 rounded bg-red-500/10">
                <div className="flex flex-col justify-center h-full text-red-800">
                  {error}
                </div>
                <div className="flex flex-col justify-center w-6 h-full ml-auto align-middle shrink-0 grow-0">
                  <button
                    type="submit"
                    onClick={() => {
                      router.push('/auth');
                    }}
                  >
                    <svg
                      className="w-full h-full text-red-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="w-full h-1 rounded-full bg-zinc-700" />

            <AuthButton company="Google" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
