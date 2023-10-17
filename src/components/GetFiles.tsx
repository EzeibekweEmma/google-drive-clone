import React from "react";
import { fetchFiles } from "@/hooks/fetchFiles";
import Image from "next/image";
import fileIcons from "@/components/fileIcons";
import { BsThreeDotsVertical } from "react-icons/bs";

function GetFiles() {
  let fileList = fetchFiles();

  const list = fileList.map((file) => {
    // getting the icon for the file
    const icon = fileIcons[file.fileExtension]
      ? fileIcons[file.fileExtension]
      : fileIcons["any"];

    const img = ["jpg", "ico", "svg", "webp", "png", "jpeg", "gif"].includes(
      file.fileExtension,
    ) ? (
      <Image
        src={file.imageLink}
        alt={file.fileName}
        height="500"
        width="500"
        draggable={false}
        className="h-full w-full rounded-md object-cover object-center"
      />
    ) : (
      <div className="h-36 w-36 ">{icon}</div>
    );

    return (
      <div className="">
        <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-darkC2 px-2.5 hover:bg-darkC">
          <div className="flex w-full items-center justify-between px-1 py-3">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-6">{icon}</div>
              <span className="w-32 truncate text-sm font-medium text-textC">
                {file.fileName}
              </span>
            </div>
            <BsThreeDotsVertical className="h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-[#ccc]" />
          </div>
          <div className="flex h-44 w-48 items-center justify-center pb-2.5">
            {img}
          </div>
        </div>
      </div>
    );
  });

  // the list of files
  return list;
}

export default GetFiles;
