import React from "react";
import { MdUploadFile } from "react-icons/md";

function UploadFileBtn({ uploadFile }: { uploadFile: Function }) {
  return (
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
  );
}

export default UploadFileBtn;
