import React from 'react';

import Spinner from './Spinner';

const LoadingPage = () => (
  <div className="pl-52 h-full w-full overflow-hidden mt-10">
    <div className="h-screen w-full bg-amber-50 flex flex-col items-center">
      <div className="bg-blue-300 h-72 w-full -mb-10" />
      <div className="max-w-4xl w-full pb-36 text-zinc-700 break-words h-full px-20 flex flex-col justify-center items-center">
        <Spinner />
      </div>
    </div>
  </div>
);

export default LoadingPage;
