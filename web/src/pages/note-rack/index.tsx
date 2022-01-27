import React from 'react';
import Router from 'next/router';

const NoteRack = () => {
  (async () => {
    const pageID = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/get-home-page`, { method: 'POST', credentials: 'include' });
    const pageJSON = await pageID.json();

    if (pageJSON.status !== 'error') {
      Router.push(`./note-rack/${pageJSON.message}`);
    } else {
      Router.push('./login');
    }
  })();

  return <div />;
};

export default NoteRack;
