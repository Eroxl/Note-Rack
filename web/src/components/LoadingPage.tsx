import React from 'react';

import Spinner from './Spinner';

const LoadingPage = () => (
  <div className="w-full h-full mt-10 overflow-hidden pl-52">
    <div className="flex flex-col items-center w-full h-screen bg-amber-50 dark:bg-zinc-700">
      <div className="w-full -mb-10 bg-blue-300 h-72" />
      <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl px-20 break-words pb-36 text-zinc-700 dark:text-amber-50">
        <Spinner />
      </div>
    </div>
  </div>
);

export default LoadingPage;
