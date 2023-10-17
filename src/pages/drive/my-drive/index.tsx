import Head from "next/head";
import { AiFillCaretDown } from "react-icons/ai";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Drive - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <div className="mb-5 flex flex-col space-y-4">
          <h2 className="text-2xl">My Drive</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
              <span>Type</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
            <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
              <span>People</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
            <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
              <span>Modified</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
          </div>
        </div>
        <div>
          <div className="mb-5 flex flex-col space-y-4">
            <h2>Folders</h2>
            <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
              <GetFolders />
              <GetFolders />
            </div>
          </div>
          <div className="mb-5 flex flex-col space-y-4">
            <h2>Files</h2>
            <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
              <GetFiles />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
