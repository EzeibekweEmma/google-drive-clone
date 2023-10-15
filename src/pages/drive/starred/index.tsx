import Head from "next/head";
import React from "react";

function index() {
  return (
    <>
      <Head>
        <title>Starred - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Starred</div>
    </>
  );
}

export default index;
