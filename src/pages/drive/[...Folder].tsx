import React from "react";
import { useRouter } from "next/router";
import GetFolders from "@/components/GetFolders";
import GetFiles from "@/components/GetFiles";

function Folder() {
  const router = useRouter();
  const { Folder } = router.query;

  return (
    <div>
      <GetFolders folderId={Folder?.[1] || ""} />
      <GetFiles folderId={Folder?.[1] || ""} />
    </div>
  );
}

export default Folder;
