import React from "react";
import { AiFillCaretDown } from "react-icons/ai";

function FileHeader({ headerName }: { headerName: string }) {
  return (
    <div className="flex flex-col space-y-6 p-5 pb-2">
      <h2 className="text-2xl">{headerName}</h2>
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Type</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>People</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
        <button className="flex items-center space-x-2 rounded-lg border border-textC px-4 py-1 text-sm font-medium">
          <span>Modified</span>
          <AiFillCaretDown className="mt-0.5 h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default FileHeader;
