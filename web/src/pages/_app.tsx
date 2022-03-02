/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/emojiPicker.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <body className="dark">
    <div className="w-screen h-screen overflow-clip">
      <Component {...pageProps} />
    </div>
  </body>
);

export default MyApp;
