import { fetchFiles } from "@/hooks/fetchFiles";
import React from "react";
import { AiFillFolder } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function GetFolders({ folderId }: { folderId: string }) {
  const { data: session } = useSession();
  let folderList = fetchFiles(folderId, session?.user.email!);
  const router = useRouter();
  const folders = folderList.map((folder) => {
    return (
      folder?.isFolder && (
        <div
          key={folder.id}
          onDoubleClick={() => router.push("/drive/folders/" + folder.id)}
          className="flex w-[13.75rem] cursor-alias items-center justify-between rounded-xl bg-darkC2 p-3 hover:bg-darkC"
        >
          <div className="flex items-center space-x-2">
            <AiFillFolder className="h-6 w-6" />
            <span className="w-32 truncate text-sm font-medium text-textC">
              {folder.folderName}
            </span>
          </div>
          <BsThreeDotsVertical className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]" />
        </div>
      )
    );
  });

  return folders;
}

export default GetFolders;
