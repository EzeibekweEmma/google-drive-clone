import React from "react";
import { MdDriveFolderUpload, MdUploadFile } from "react-icons/md";

function UploadFileBtn({
  uploadFile,
  uploadFolderFiles,
}: {
  uploadFile: Function;
  uploadFolderFiles?: Function;
}) {
  const folderUploadProps = {
    webkitdirectory: "",
    directory: "",
  } as unknown as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <>
      <button className="relative flex w-full items-center space-x-3 px-4 py-1.5 hover:bg-darkC">
        <MdUploadFile className="h-5 w-5" />
        <input
          type="file"
          multiple
          onChange={(e) => uploadFile(e)}
          className="absolute -left-3 top-0 h-full w-full cursor-pointer bg-slate-300 opacity-0"
        />
        <span>File upload</span>
      </button>
      <button className="relative flex w-full items-center space-x-3 px-4 py-1.5 hover:bg-darkC">
        <MdDriveFolderUpload className="h-5 w-5" />
        <input
          type="file"
          multiple
          onChange={(e) => uploadFolderFiles?.(e)}
          className="absolute -left-3 top-0 h-full w-full cursor-pointer bg-slate-300 opacity-0"
          {...folderUploadProps}
        />
        <span>Folder upload</span>
      </button>
    </>
  );
}

export default UploadFileBtn;
