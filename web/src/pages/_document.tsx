import {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

// -=- Document -=-
// ~ The main document component
const Document = () => (
  <Html>
    <Head>
      {/* ~ Favicon */}
      <link rel="icon" href="/Memo.svg" type="image/svg+xml" />
    </Head>
    {/* ~ Body w/ dark mode enabled */}
    <body className="dark">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
