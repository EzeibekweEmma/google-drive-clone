import React from "react";
import { MdDriveFolderUpload, MdOutlineCreateNewFolder } from "react-icons/md";
import UploadFileBtn from "./UploadFileBtn";

// The DropDown component renders a dropdown menu for creating new folders and uploading files.
function DropDown({
  setFolderToggle,
  setIsDropDown,
  uploadFile,
}: folderToggleAndUpload) {
  return (
    <div
      onClick={() => setIsDropDown(false)} // Close the pop-up when clicking outside
      className="absolute -left-5 -top-20 flex h-screen w-screen items-center justify-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicks inside the form from closing the pop-up
        }}
        className="absolute left-6 top-[68px] w-72 rounded-md bg-white text-textC shadow-md shadow-[#bbb]"
      >
        {/* New folder section */}
        <div className="border-b py-2">
          <button
            onClick={() => setFolderToggle(true)} // Trigger the "New folder" action
            className="flex w-full items-center space-x-3 px-4 py-1.5 hover:bg-darkC"
          >
            <MdOutlineCreateNewFolder className="h-5 w-5" />
            {/* Icon for creating a new folder */}
            <span>New folder</span>
          </button>
        </div>
        {/* File and folder upload section */}
        <div className="border-b py-2">
          {/* Upload file button */}
          <UploadFileBtn uploadFile={uploadFile} />
          {/* Folder upload button */}
          <button className="flex w-full items-center space-x-3 px-4 py-1.5 hover:bg-darkC">
            <MdDriveFolderUpload className="h-5 w-5" />
            <span>Folder upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DropDown;
