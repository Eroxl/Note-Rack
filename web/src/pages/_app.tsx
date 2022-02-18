/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className="w-screen h-screen overflow-clip">
    <Component {...pageProps} />
  </div>
);

export default MyApp;
