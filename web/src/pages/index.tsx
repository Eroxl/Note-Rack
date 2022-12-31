import type { NextPage, GetServerSidePropsContext } from 'next';
import React from 'react';

import NavBar from '../components/home/NavBar';

const Home: NextPage = () => (
  <div className="w-screen h-screen bg-amber-50">
    <div className="h-full mx-auto max-w-7xl">
      <NavBar />
    </div>
  </div>
);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req } = context;

  if (req.cookies.accessToken) {
    return {
      redirect: {
        permanent: true,
        destination: '/note-rack',
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
