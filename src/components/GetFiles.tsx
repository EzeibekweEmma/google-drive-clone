import React, { useState } from "react";
import { useFetchFiles } from "@/hooks/fetchFiles";
import Image from "next/image";
import fileIcons from "@/components/fileIcons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSession } from "next-auth/react";
import FileDropDown from "./FileDropDown";
import { useFetchAllFiles } from "@/hooks/fetchAllFiles";
import Rename from "./Rename";

function GetFiles({ folderId, select }: { folderId: string; select: string }) {
  const [openMenu, setOpenMenu] = useState("");
  const [renameToggle, setRenameToggle] = useState("");

  const { data: session } = useSession();

  const fileListByFolder = useFetchFiles(folderId, session?.user.id, session?.user.email ?? undefined);
  const fileListAll = useFetchAllFiles(session?.user.id, session?.user.email ?? undefined);
  
  const fileList = select ? fileListAll : fileListByFolder;

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const handleMenuToggle = (fileId: string) => {
    // Toggle the dropdown for the given file
    setRenameToggle("");
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === fileId ? "" : fileId));
    window.dispatchEvent(
      new CustomEvent("drive-menu-open", {
        detail: { fileId, source: "files" },
      }),
    );
  };

  React.useEffect(() => {
    const handleCloseOtherMenus = (event: Event) => {
      const customEvent = event as CustomEvent<{ fileId: string; source: string }>;
      if (customEvent.detail?.source !== "files") {
        setOpenMenu("");
        setRenameToggle("");
      }
    };

    window.addEventListener("drive-menu-open", handleCloseOtherMenus);
    return () => {
      window.removeEventListener(
        "drive-menu-open",
        handleCloseOtherMenus,
      );
    };
  }, []);

  const list = fileList.map((file) => {
    // getting the icon for the file
    const icon =
      fileIcons[file.fileExtension as keyof typeof fileIcons] ??
      fileIcons.any;

    const img = ["jpg", "ico", "webp", "png", "jpeg", "gif", "jfif"].includes(
      file.fileExtension ?? "",
    ) ? (
      <Image
        src={file.fileLink ?? ""}
        alt={file.fileName ?? "image"}
        height="500"
        width="500"
        draggable={false}
        className="h-full w-full rounded-sm object-cover object-center"
      />
    ) : file.fileExtension === "mp3" ? (
      <div className="flex flex-col items-center justify-center">
        <div className="h-24 w-24 ">{icon}</div>
        <audio controls className="w-44">
          <source src={file.fileLink ?? ""} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    ) : file.fileExtension === "mp4" ? (
      <video controls>
        <source src={file.fileLink ?? ""} type="video/mp4" />
        <div className="h-36 w-36 ">{icon}</div>
      </video>
    ) : (
      <div className="h-36 w-36 ">{icon}</div>
    );

    // set a condition for the files to be displayed
    let condition = !file?.isFolder && !(file?.isTrashed ?? false);
    if (select === "starred")
      condition = !file?.isFolder && (file?.isStarred ?? false) && !(file?.isTrashed ?? false);
    else if (select === "trashed")
      condition = !file?.isFolder && (file?.isTrashed ?? false);

    return (
      condition && (
        <div
          key={file.id}
          onDoubleClick={() => file.fileLink && openFile(file.fileLink)}
          className="hover:cursor-alias"
        >
          <div
            className="flex w-full flex-col items-center justify-center
         overflow-visible rounded-xl bg-darkC2 px-2.5 hover:bg-darkC"
          >
            <div className="relative flex w-full items-center justify-between px-1 py-3">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-6">{icon}</div>
                <span className="w-32 truncate text-sm font-medium text-textC">
                  {file.fileName}
                </span>
              </div>
              <BsThreeDotsVertical
                onClick={(event) => {
                  event.stopPropagation();
                  if (file.id) {
                    handleMenuToggle(file.id);
                  }
                }}
                className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]"
              />
              {
                /* drop down */
                openMenu === file.id && (
                  <FileDropDown
                    file={{ ...file, folderName: file.folderName ?? "", isFolder: file.isFolder ?? false, isStarred: file.isStarred ?? false, isTrashed: file.isTrashed ?? false, id: file.id ?? "", fileLink: file.fileLink ?? "", fileName: file.fileName ?? "", fileExtension: file.fileExtension ?? "", folderId: file.folderId ?? "" }}
                    setOpenMenu={setOpenMenu}
                    isFolderComp={false}
                    select={select}
                    folderId=""
                    setRenameToggle={setRenameToggle}
                  />
                )
              }
              {
                // rename toggle
                renameToggle === file.id && (
                  <Rename
                    setRenameToggle={setRenameToggle}
                    fileId={file.id}
                    isFolder={file.isFolder ?? false}
                    fileName={file.fileName ?? ""}
                    fileExtension={file.fileExtension ?? ""}
                  />
                )
              }
            </div>
            <div className="flex h-44 w-48 items-center justify-center pb-2.5">
              {img}
            </div>
          </div>
        </div>
      )
    );
  });

  // the list of files
  return list;
}

export default GetFiles;
