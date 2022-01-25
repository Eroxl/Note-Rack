import type { NextPage } from 'next';
import React from 'react';

import NavBar from '../components/home/NavBar';

const Home: NextPage = () => (
  <div className="h-screen w-screen bg-amber-50">
    <div className="max-w-7xl h-full mx-auto">
      <NavBar />
    </div>
  </div>
);

export default Home;
