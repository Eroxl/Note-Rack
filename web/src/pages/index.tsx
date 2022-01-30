import type { NextPage, GetServerSidePropsContext } from 'next';
import React from 'react';

import NavBar from '../components/home/NavBar';

const Home: NextPage = () => (
  <div className="h-screen w-screen bg-amber-50">
    <div className="max-w-7xl h-full mx-auto">
      <NavBar />
    </div>
  </div>
);

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req } = context;

  if (req.cookies['ssn-token'] || req.cookies['rfrsh-token']) {
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
