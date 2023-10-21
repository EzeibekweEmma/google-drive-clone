import React from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdDriveFileRenameOutline,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import { renameFile, starFile, trashFile } from "@/API/Firestore";

function FileDropDown({ file, setOpenMenu }: FileDropDownProps) {
  const openFile = (fileLink: string) => {
    // Open the file in a new tab
    window.open(fileLink, "_blank");
  };

  const changeFileName = (fileId: string, fileName: string) => {
    renameFile(fileId, fileName);
  };

  return (
    <section
      onClick={() => setOpenMenu("")}
      className="absolute top-9 z-10 h-40 w-48 overflow-y-scroll rounded-md border bg-white shadow-sm shadow-[#777]"
    >
      <div
        onClick={() => openFile(file.fileLink)}
        className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
      >
        <HiOutlineArrowsExpand className="h-5 w-5" />
        <span className="text-sm">Open File</span>
      </div>
      <a
        href={file.fileLink}
        download={file.fileName}
        className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
      >
        <TbDownload className="h-5 w-5" />
        <span className="text-sm">Download</span>
      </a>

      <div
        onClick={() => changeFileName(file.id, file.fileName)}
        className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
      >
        <MdDriveFileRenameOutline className="h-5 w-5" />
        <span className="text-sm">Rename</span>
      </div>
      <div className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]">
        {!file.isStarred ? (
          <MdStarBorder className="h-5 w-5" />
        ) : (
          <MdStarRate className="h-5 w-5" />
        )}
        <span
          onClick={() => starFile(file.id, !file.isStarred)}
          className="text-sm"
        >
          Add to starred
        </span>
      </div>
      <div
        onClick={() => trashFile(file.id, !file.isTrashed)}
        className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
      >
        <RiDeleteBin6Line className="h-5 w-5" />
        <span className="text-sm">Move to bin</span>
      </div>
    </section>
  );
}

export default FileDropDown;
