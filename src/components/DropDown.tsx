import React from "react";
import {
  MdDriveFolderUpload,
  MdOutlineCreateNewFolder,
  MdUploadFile,
} from "react-icons/md";

// The DropDown component renders a dropdown menu for creating new folders and uploading files.
function DropDown({ setAddNewFolder }: AddNewFolderProps) {
  return (
    <div className="text-textC absolute -top-2 left-1 w-72 rounded-md bg-white shadow-md shadow-[#bbb]">
      {/* New folder section */}
      <div className="border-b py-2">
        <button
          onClick={() => setAddNewFolder(true)} // Trigger the "New folder" action
          className="hover:bg-darkC flex w-full items-center space-x-3 px-4 py-1.5"
        >
          <MdOutlineCreateNewFolder className="h-5 w-5" />{" "}
          {/* Icon for creating a new folder */}
          <span>New folder</span>
        </button>
      </div>
      {/* File and folder upload section */}
      <div className="border-b py-2">
        <button className="hover:bg-darkC flex w-full items-center space-x-3 px-4 py-1.5">
          <MdUploadFile className="h-5 w-5" /> {/* Icon for file upload */}
          <span>File upload</span>
        </button>
        <button className="hover:bg-darkC flex w-full items-center space-x-3 px-4 py-1.5">
          <MdDriveFolderUpload className="h-5 w-5" />{" "}
          {/* Icon for folder upload */}
          <span>Folder upload</span>
        </button>
      </div>
    </div>
  );
}

export default DropDown;
