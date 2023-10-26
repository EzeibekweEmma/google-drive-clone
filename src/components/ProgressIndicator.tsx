"use client";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdCheckmarkCircle,
} from "react-icons/io";
import fileIcons from "./fileIcons";

function ProgressIndicator({
  progress,
  fileName,
  setFileName,
}: ProgressIndicatorProps) {
  const [minimize, setMinimize] = useState(true);

  // show all file name and progress
  const fileNames = fileName?.map((name, index) => {
    const fileExtension = name.split(".").pop();
    return (
      <div
        key={index}
        className="flex cursor-pointer items-center justify-between bg-white py-2.5 pl-4 pr-2 hover:bg-darkC"
      >
        <div className="flex items-center space-x-3">
          {fileExtension && fileIcons[fileExtension] ? (
            <div className="h-6 w-6">{fileIcons[fileExtension]}</div>
          ) : (
            <div className="h-6 w-6">{fileIcons["any"]}</div>
          )}
          <span className="w-60 truncate">{name}</span>
        </div>
        {progress[index]! < 100 ? (
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
          className={`absolute right-8 z-20 w-[23rem] overflow-hidden rounded-t-2xl shadow-sm shadow-textC tablet:right-10 ${
            minimize ? "-bottom-4" : "-top-10"
          }`}
        >
          <div className="flex items-center justify-between bg-bgc py-2 pl-4 pr-2">
            {progress[0]! < 100 ? (
              <h3 className="flex items-center space-x-5 font-medium text-textC">
                <span className="animate-pulse">Uploading file</span>
                <AiOutlineLoading3Quarters className="animate-spin text-green-600" />
              </h3>
            ) : (
              <h3 className="font-medium text-textC">
                {fileName.length} upload{fileName.length > 1 && "s"} complete
              </h3>
            )}
            <div className="flex items-center">
              <div>
                {minimize ? (
                  <IoIosArrowDown
                    onClick={() => setMinimize(!minimize)}
                    className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
                    stroke="2"
                  />
                ) : (
                  <IoIosArrowUp
                    onClick={() => setMinimize(!minimize)}
                    className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
                    stroke="2"
                  />
                )}
              </div>
              <AiOutlineClose
                onClick={() => setFileName([])}
                className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC"
              />
            </div>
            {/* uploaded files progress */}
          </div>
          <div className="flex max-h-60 flex-col overflow-y-scroll">
            {fileNames}
          </div>
        </div>
      </div>
    )
  );
}

export default ProgressIndicator;
