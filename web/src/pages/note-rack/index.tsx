/* eslint-disable no-empty */
import React, { useEffect } from 'react';
import Router from 'next/router';

const NoteRack = () => {
  useEffect(() => {
    (async () => {
      try {
        const pageID = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-home-page`, { method: 'POST', credentials: 'include' });

        if (pageID.status === 401) {
          Router.push('/auth/login');
          return;
        }
        const pageJSON = await pageID.json();

        if (pageJSON.status !== 'error') {
          Router.push(`./note-rack/${pageJSON.message}`);
          return;
        }
      } catch (error) {}

      Router.push('/login');
    })();
  }, []);

  return <div />;
};

export default NoteRack;
