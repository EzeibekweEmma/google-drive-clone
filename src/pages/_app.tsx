import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type AppType } from "next/app";
import { type ReactNode } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import Header from "@/components/headerComponents/Header";
import SideMenu from "@/components/SideMenu";

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn("google", {
        callbackUrl: router.asPath,
      });
    },
  });

  if (status !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bgc">
        <p className="text-textC">Redirecting to login...</p>
      </main>
    );
  }

  return <>{children}</>;
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  // Public routes
  const isSharePage = router.pathname.startsWith("/share/");

  // Public layout
  if (isSharePage) {
    return (
      <SessionProvider session={session}>
        <main className="min-h-screen bg-bgc">
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    );
  }

  // Protected app
  return (
    <SessionProvider session={session}>
      <AuthGate>
        <main className="flex h-screen flex-col overflow-hidden bg-bgc">
          <Header />

          <section className="mb-5 flex flex-1 overflow-hidden px-5 pr-16">
            <div>
              <SideMenu />
            </div>

            <div className="flex flex-1">
              <div className="h-[90vh] w-full overflow-hidden rounded-2xl bg-white">
                <Component {...pageProps} />
              </div>
            </div>
          </section>
        </main>
      </AuthGate>
    </SessionProvider>
  );
};

export default MyApp;
