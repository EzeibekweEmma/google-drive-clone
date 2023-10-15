import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "@/styles/globals.css";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className="bg-bgc flex h-screen flex-col items-center justify-between  overflow-hidden">
        <Header />
        <section className="mb-5 flex h-full w-screen flex-1 px-5 pr-16">
          <SideMenu />
          <div className="flex flex-1 rounded-2xl bg-white p-5 pb-3">
            <Component {...pageProps} />
          </div>
        </section>
      </main>
    </SessionProvider>
  );
};

export default MyApp;
