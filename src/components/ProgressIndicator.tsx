"use client";
import React, { useState } from "react";
import {
  AiOutlineClose,
  AiFillFileZip,
  AiOutlineLoading3Quarters,
  AiFillFile,
} from "react-icons/ai";
import {
  MdMovie,
  MdFolderOpen,
  MdPictureAsPdf,
  MdLibraryMusic,
} from "react-icons/md";
import {
  BiSolidImageAlt,
  BiSolidFileTxt,
  BiSolidFileDoc,
} from "react-icons/bi";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdCheckmarkCircle,
} from "react-icons/io";

function ProgressIndicator({
  progress,
  fileName,
  setFileName,
}: ProgressIndicatorProps) {
  const [minimize, setMinimize] = useState(true);

  // Map of file extensions to corresponding icons
  const fileIcons = {
    mp4: <MdMovie className="h-6 w-6 text-[#CA2E24]" />,
    mp3: <MdLibraryMusic className="h-6 w-6 text-[#CA2E24]" />,
    pdf: <MdPictureAsPdf className="h-6 w-6 text-[#CA2E24]" />,
    jpg: <BiSolidImageAlt className="h-6 w-6 text-[#CA2E24]" />,
    jpeg: <BiSolidImageAlt className="h-6 w-6 text-[#CA2E24]" />,
    png: <BiSolidImageAlt className="h-6 w-6 text-[#CA2E24]" />,
    docx: <BiSolidFileDoc className="h-6 w-6 text-[#447DD7]" />,
    txt: <BiSolidFileTxt className="h-6 w-6 text-[#447DD7]" />,
    zip: <AiFillFileZip className="text-textC h-6 w-6" />,
  };

  // show all file name and progress
  const fileNames = fileName?.map((name, index) => {
    const fileExtension = name.split(".").pop();
    return (
      <div
        key={index}
        className="hover:bg-darkC flex cursor-pointer items-center justify-between bg-white py-2.5 pl-4 pr-2"
      >
        <div className="flex items-center space-x-3">
          {fileIcons[fileExtension] ? (
            fileIcons[fileExtension]
          ) : (
            <AiFillFile className="h-6 w-6 text-[#447DD7]" />
          )}
          <span className="w-60 truncate">{name}</span>
        </div>
        {progress[index] < 100 ? (
          <span className="pr-2">{progress[index]}%</span>
        ) : (
          <IoMdCheckmarkCircle className="h-9 w-9 p-1.5 pr-2 text-green-600" />
        )}
      </div>
    );
  });

  return (
    fileName.length > 0 && (
      <div className="absolute bottom-0 w-screen">
        <div
          className={`shadow-textC absolute right-10 w-[23rem] overflow-hidden rounded-t-2xl shadow-sm ${
            minimize ? "-bottom-3" : "-top-10"
          }`}
        >
          <div className="bg-bgc flex items-center justify-between py-2 pl-4 pr-2">
            {progress[0] < 100 ? (
              <h3 className="text-textC flex items-center space-x-5 font-medium">
                <span>{fileName.length} Uploading file</span>
                <AiOutlineLoading3Quarters className="animate-spin text-green-600" />
              </h3>
            ) : (
              <h3 className="text-textC font-medium">
                {fileName.length} upload{fileName.length > 1 && "s"} complete
              </h3>
            )}
            <div className="flex items-center">
              <div>
                {minimize ? (
                  <IoIosArrowDown
                    onClick={() => setMinimize(!minimize)}
                    className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2"
                    stroke="2"
                  />
                ) : (
                  <IoIosArrowUp
                    onClick={() => setMinimize(!minimize)}
                    className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2"
                    stroke="2"
                  />
                )}
              </div>
              <AiOutlineClose
                onClick={() => setFileName([])}
                className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2"
              />
            </div>
            {/* uploaded files progress */}
          </div>
          <div className="flex flex-col">{fileNames}</div>
        </div>
      </div>
    )
  );
}

export default ProgressIndicator;
