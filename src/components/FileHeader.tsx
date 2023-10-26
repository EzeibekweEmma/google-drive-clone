import { useRouter } from "next/router";
import React from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { BsArrowLeftCircle } from "react-icons/bs";

function FileHeader({ headerName }: { headerName: string }) {
  const router = useRouter();
  const isNestedFolder = router.route === "/drive/[...Folder]";

  return (
    <div className="flex flex-col space-y-6 p-5 pb-2">
      <div className="flex items-center space-x-2 text-2xl text-textC">
        {isNestedFolder && (
          <BsArrowLeftCircle
            className="h-6 w-6 cursor-pointer"
            onClick={() => router.back()}
          />
        )}
        <h2>{headerName}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
