import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import NavBar from '../components/home/NavBar';
import Intro from '../components/home/Intro';
import Info from '../components/home/Info';

const Home: NextPage = () => (
  <div className="w-screen h-full px-4 mx-auto overflow-scroll bg-white text-zinc-700 max-w-7xl no-scrollbar">
    <NavBar />
    <Intro />
    <Info />
  </div>
);

const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { cookies } = req;

  if (cookies.sIRTFrontend && cookies.sIRTFrontend !== '' && cookies.sIRTFrontend !== 'remove') {
    res.setHeader('location', '/note-rack');
    res.statusCode = 302;
  }

  return {
    props: {},
  };
};

export { getServerSideProps };

export default Home;
