import Head from "next/head";
import React from "react";

function index() {
  return (
    <>
      <Head>
        <title>Bin - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Trash</div>
    </>
  );
}

export default index;
