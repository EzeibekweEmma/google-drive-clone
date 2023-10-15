import Head from "next/head";
import Link from "next/link";
import { AiFillCaretDown, AiFillFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Drive - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="mb-5 flex flex-col space-y-4">
          <h2 className="text-2xl">My Drive</h2>
          <div className="flex items-center space-x-2">
            <button className="border-textC flex items-center space-x-2 rounded-lg border px-4 py-1 text-sm font-medium">
              <span>Type</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
            <button className="border-textC flex items-center space-x-2 rounded-lg border px-4 py-1 text-sm font-medium">
              <span>People</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
            <button className="border-textC flex items-center space-x-2 rounded-lg border px-4 py-1 text-sm font-medium">
              <span>Modified</span>
              <AiFillCaretDown className="mt-0.5 h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="mb-5 flex flex-col space-y-4">
          <h2>Folders</h2>
          <div className="text-textC grid grid-cols-4 items-center gap-4">
            <div className="bg-darkC2 flex w-60 items-center justify-between rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <AiFillFolder className="h-6 w-6" />
                <span className="font-medium">Title</span>
              </div>
              <BsThreeDotsVertical className="hover:bg-darkC h-6 w-6 cursor-pointer rounded-full p-1" />
            </div>
          </div>
        </div>
        <div className="mb-5 flex flex-col space-y-4">
          <h2>Files</h2>
          <div></div>
        </div>
      </div>
    </>
  );
}
