/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';

import '../styles/globals.css';
import '../styles/emojiPicker.css';
import superTokensConfig from '../config/superTokensConfig';

if (typeof window !== 'undefined') {
  SuperTokensReact.init(superTokensConfig());
}

const App = ({ Component, pageProps }: AppProps) => (
  <SuperTokensWrapper>
    <div className="w-screen h-screen overflow-clip print:overflow-visible">
      <Component {...pageProps} />
    </div>
  </SuperTokensWrapper>
);

export default App;
