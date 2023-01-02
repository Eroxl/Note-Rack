import React, { useEffect } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';
import { useRouter } from 'next/router';
import { signInAndUp } from 'supertokens-auth-react/recipe/thirdparty';

import Spinner from '../../../components/Spinner';
import AuthNavBar from '../../../components/home/AuthNavBar';

const Callback = () => {
  const router = useRouter();
  const { provider } = router.query;

  useEffect(() => {
    (async () => {
      try {
        const response = await signInAndUp();

        if (response.status === 'OK') {
          router.push('/note-rack');

          window.location.assign('/note-rack');
        } else {
          window.location.assign('/auth?error=Something went wrong');
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).isSuperTokensGeneralError) {
          redirectToAuth({
            queryParams: {
              error: (error as Error).message,
            },
          });
        } else {
          window.location.assign('/auth?error=Something went wrong');
        }
      }
    })();
  }, [provider]);

  return (
    <div className="relative flex flex-col items-center w-screen h-screen bg-amber-50">
      <div className="z-10 w-full max-w-7xl">
        <AuthNavBar />
      </div>
      {/* Login / Signup Page */}
      <div className="flex flex-col items-center justify-center h-2/3">
        {/* Sign Up / Sign In Providers */}
        <div className="flex flex-col p-5 border-2 rounded-md sm:p-10 border-zinc-700">
          <div className="z-10 flex flex-col items-center justify-center gap-5 w-96 h-">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callback;
