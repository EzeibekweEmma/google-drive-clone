import React from "react";
import { fetchFiles } from "@/hooks/fetchFiles";
import Image from "next/image";
import fileIcons from "@/components/fileIcons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSession } from "next-auth/react";

function GetFiles({ folderId }: { folderId: string }) {
  const { data: session } = useSession();
  let fileList = fetchFiles(folderId, session?.user.email!);
  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  const list = fileList.map((file) => {
    // getting the icon for the file
    const icon = fileIcons[file.fileExtension]
      ? fileIcons[file.fileExtension]
      : fileIcons["any"];

    const img = ["jpg", "ico", "webp", "png", "jpeg", "gif"].includes(
      file.fileExtension,
    ) ? (
      <Image
        src={file.fileLink}
        alt={file.fileName}
        height="500"
        width="500"
        draggable={false}
        className="h-full w-full rounded-sm object-cover object-center"
      />
    ) : file.fileExtension === "mp3" ? (
      <div className="flex flex-col items-center justify-center">
        <div className="h-24 w-24 ">{icon}</div>
        <audio controls className="w-44">
          <source src={file.fileLink} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    ) : file.fileExtension === "mp4" ? (
      <video controls>
        <source src={file.fileLink} type="audio/mpeg" />
        <div className="h-36 w-36 ">{icon}</div>
      </video>
    ) : (
      <div className="h-36 w-36 ">{icon}</div>
    );
    return (
      !file?.isFolder && (
        <div
          key={file.id}
          onDoubleClick={() => openFile(file.fileLink)}
          className="hover:cursor-alias"
        >
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
      )
    );
  });

  // the list of files
  return list;
}

export default GetFiles;
