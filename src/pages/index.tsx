import Head from "next/head";
import Link from "next/link";
import Button from "@/components/common/Button";
import AuthBtn from "@/components/AuthBtn";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Google Drive Clone</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between bg-[#F7F9FC]">
        <Header />
        <section>
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            Body here!
          </div>
        </section>
      </main>
    </>
  );
}
