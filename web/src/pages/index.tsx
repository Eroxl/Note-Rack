import Router from 'next/router';
import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import Session from 'supertokens-auth-react/recipe/session';

import NavBar from '../components/home/NavBar';

const Home: NextPage = () => {
  useEffect(() => {
    (async () => {
      // -=- Verification -=-
      // ~ Check if the user is logged in
      const session = await Session.doesSessionExist();

      // ~ If the user is logged in, redirect them to their home page
      if (session !== false) {
        Router.push('/note-rack');
        return;
      }
    })();
  }, []);

  return (
    <div className="w-screen h-screen bg-amber-50">
      <div className="h-full mx-auto max-w-7xl">
        <NavBar />
      </div>
    </div>
  );
};

export default Home;
