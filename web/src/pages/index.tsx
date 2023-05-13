import Router from 'next/router';
import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import Session from 'supertokens-auth-react/recipe/session';

import NavBar from '../components/home/NavBar';
import Intro from '../components/home/Intro';
import Info from '../components/home/Info';

const Home: NextPage = () => {
  // TODO:EROXL: (2023-01-24) This should be done server side when the request is made
  useEffect(() => {
    (async () => {
      // -=- Verification -=-
      // ~ Check if the user is logged in
      const session = await Session.doesSessionExist();

      // ~ If the user is logged in, redirect them to their home page
      if (session !== false) {
        Router.push('/note-rack');
      }
    })();
  }, []);

  // -=- Render -=-
  // ~ Render the home page, if the user is not logged in
  return (
    <div className="w-screen h-full px-4 mx-auto overflow-scroll bg-white text-zinc-700 max-w-7xl no-scrollbar">
      <NavBar />

      <Intro />

      <Info />
    </div>
  );
};

export default Home;
