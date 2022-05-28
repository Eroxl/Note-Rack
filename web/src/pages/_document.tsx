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
    <body className="">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
