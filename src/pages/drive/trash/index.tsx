import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchFiles } from "@/hooks/fetchFiles";
import { DotLoader } from "react-spinners";

export default function Index() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  // Fetch the list of files and folders
  const list = fetchFiles("", session?.user.email!);

  useEffect(() => {
    // Determine if there are folders and files in the list
    const hasFolders = list.some((item) => item.isFolder && item.isTrashed);
    const hasFiles = list.some((item) => !item.isFolder && item.isTrashed);
    // Update the state based on the results
    setIsFolder(hasFolders);
    setIsFile(hasFiles);

    setTimeout(() => {
      setIsLoading(false);
    }, 2200);
  }, [list]);

  return (
    <>
      <Head>
        <title>Bin - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader headerName={"Bin for My Drive"} />
        <div className="h-[75vh] w-full overflow-y-auto p-5">
          {/* If the list is loading, display the loading state */}
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#b8c2d7" size={60} />
            </div>
          ) : (
            <>
              {/* If there are files or folders, display them */}
              {isFile || isFolder ? (
                <>
                  {isFolder && (
                    // If there are folders, display them
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Folders</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFolders folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    // If there are files, display them
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles folderId="" select="trashed" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // If there are no files or folders, display the empty state
                <div className="flex h-full flex-col items-center justify-center">
                  <Image
                    draggable={false}
                    src="/empty_state_trash.svg"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-48 object-cover object-center"
                  />
                  <h2 className="mb-4 text-2xl">Bin is empty</h2>
                  <p className="mb-3 text-sm text-gray-600">
                    Items moved to the bin will be deleted forever after 30 days
                  </p>
                  <span className="cursor-pointer text-blue-700 hover:underline">
                    Learn more
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
