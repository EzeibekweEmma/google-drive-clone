import React from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdDriveFileRenameOutline,
  MdOutlineRestore,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import { deleteFile, renameFile, starFile, trashFile } from "@/API/Firestore";
import { useRouter } from "next/router";

function FileDropDown({
  file,
  setOpenMenu,
  select,
  isFolderComp,
  folderId,
  setRenameToggle,
}: FileDropDownProps) {
  const router = useRouter();

  const openFile = (fileLink: string) => {
    // Open the file in a new tab
    window.open(fileLink, "_blank");
  };

  return (
    <section
      onClick={() => setOpenMenu("")}
      className={`absolute top-9 z-10 ${
        select == "trashed" ? "h-fit" : "h-40"
      } w-48 overflow-y-scroll rounded-md border bg-white shadow-sm shadow-[#777]`}
    >
      {select !== "trashed" ? (
        <>
          <div
            onClick={() =>
              isFolderComp
                ? router.push("/drive/folders/" + folderId)
                : openFile(file.fileLink)
            }
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <HiOutlineArrowsExpand className="h-5 w-5" />
            <span className="text-sm">Open File</span>
          </div>
          {!isFolderComp && (
            <a
              href={file.fileLink}
              download={file.fileName}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <TbDownload className="h-5 w-5" />
              <span className="text-sm">Download</span>
            </a>
          )}

          <div
            onClick={() => setRenameToggle(file.id)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <MdDriveFileRenameOutline className="h-5 w-5" />
            <span className="text-sm">Rename</span>
          </div>
          <div
            onClick={() => starFile(file.id, !file.isStarred)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            {!file.isStarred ? (
              <MdStarBorder className="h-5 w-5" />
            ) : (
              <MdStarRate className="h-5 w-5" />
            )}
            <span className="text-sm">Add to starred</span>
          </div>
          <div
            onClick={() => trashFile(file.id, true)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
            <span className="text-sm">Move to bin</span>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => trashFile(file.id, false)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <MdOutlineRestore className="h-5 w-5" />
            <span className="text-sm">Restore</span>
          </div>
          <div
            onClick={() => deleteFile(file.id, file.isFolder)}
            className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
            <span className="text-sm">Delete forever</span>
          </div>
        </>
      )}
    </section>
  );
}

export default FileDropDown;
