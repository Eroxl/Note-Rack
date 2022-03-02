import {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/Memo.svg" type="image/svg+xml" />
    </Head>
    <body className="dark">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
