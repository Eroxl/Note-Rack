/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/emojiPicker.css';

const App = ({ Component, pageProps }: AppProps) => (
  <div className="w-screen h-screen overflow-clip">
    <Component {...pageProps} />
  </div>
);

export default App;
