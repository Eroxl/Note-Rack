/* eslint-disable no-empty */
import React, { useEffect } from 'react';
import Router from 'next/router';
import Session from 'supertokens-auth-react/recipe/session';

const NoteRack = () => {
  useEffect(() => {
    (async () => {
      // -=- Verification -=-
      // ~ Check if the user is logged in
      const session = await Session.doesSessionExist();

      // ~ If the user is not logged in, redirect them to the login page
      if (session === false) {
        Router.push('/auth');
        return;
      }

      // -=- Home Page Redirect -=-
      // Get the user's home page
      const pageID = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/page/get-home-page`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      const pageIDJSON = await pageID.json();

      if (pageIDJSON.status !== 'error') {
        Router.push(`./note-rack/${pageIDJSON.message}`);
        return;
      }

      Router.push('/auth');
    })();
  }, []);

  return (
    <div className="relative flex flex-col items-center w-screen h-screen bg-amber-50 dark:bg-zinc-700" />
  );
};

export default NoteRack;
