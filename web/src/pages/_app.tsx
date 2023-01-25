/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';
import SuperTokensReact, { SuperTokensWrapper } from 'supertokens-auth-react';

import '../styles/globals.css';
import '../styles/emojiPicker.css';
import superTokensConfig from '../config/superTokensConfig';

// -=- Initialization -=-
// ~ If we're in the browser, initialize SuperTokens
if (typeof window !== 'undefined') {
  // ~ Initialize SuperTokens
  SuperTokensReact.init(superTokensConfig());
}

// -=- App -=-
// ~ The main app component
const App = ({ Component, pageProps }: AppProps) => (
  <SuperTokensWrapper>
    <div className="w-screen h-screen overflow-clip print:overflow-visible">
      <Component {...pageProps} />
    </div>
  </SuperTokensWrapper>
);

export default App;
