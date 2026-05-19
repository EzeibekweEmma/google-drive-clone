import React from "react";
import { useRouter } from "next/router";
import GetFolders from "@/components/GetFolders";
import GetFiles from "@/components/GetFiles";
import Head from "next/head";
import FileHeader from "@/components/FileHeader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchFiles } from "@/hooks/fetchFiles";
import { fetchAllFiles } from "@/hooks/fetchAllFiles";
import { DotLoader } from "react-spinners";

function Folder() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { Folder } = router.query;

  const { data: session } = useSession();
  const currentFolderId = Folder?.[1] || "";

  // Fetch the list of files and folders
  const list = fetchFiles(
    currentFolderId,
    session?.user.id!,
    session?.user.email,
  );
  const allFiles = fetchAllFiles(session?.user.id!, session?.user.email);
  const currentFolder = allFiles.find(
    (item) => item.id === currentFolderId && item.isFolder,
  );
  const headerName = currentFolder?.folderName || "Folder";
  const breadcrumbs = React.useMemo(() => {
    if (!currentFolderId) return [{ id: "", label: "My Drive" }];

    const folderMap = new Map(
      allFiles.filter((item) => item.isFolder).map((item) => [item.id, item]),
    );
    const trail = [];
    let pointer = folderMap.get(currentFolderId);

    while (pointer) {
      trail.unshift({
        id: pointer.id,
        label: pointer.folderName || "Folder",
      });

      if (!pointer.folderId) break;
      pointer = folderMap.get(pointer.folderId);
    }

    return [{ id: "", label: "My Drive" }, ...trail];
  }, [allFiles, currentFolderId]);

  useEffect(() => {
    // Determine if there are folders and files in the list
    const hasFolders = list.some((item) => item.isFolder);
    const hasFiles = list.some((item) => !item.isFolder);

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
        <title>{headerName} - Google Drive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader headerName={headerName} breadcrumbs={breadcrumbs} />
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
                        <GetFolders folderId={currentFolderId} select={""} />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    // If there are files, display them
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles folderId={currentFolderId} select={""} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // If there are no files or folders, display the empty state
                <div className="flex h-full flex-col items-center justify-center">
                  <Image
                    draggable={false}
                    src="/empty_state_folder.png"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-full max-w-md object-cover object-center opacity-75"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Folder;
