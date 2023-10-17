"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./addBtnComponents/DropDown";
import AddFolder from "./addBtnComponents/AddFolder";
import Navbar from "./Navbar";
import fileUpload from "@/API/FileUpload";
import ProgressIndicator from "./ProgressIndicator";

function SideMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [addNewFolder, setAddNewFolder] = useState(false);

  // Add new file
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName((prev) => [...prev, file.name]);
    fileUpload(file, setProgress);
  };
  fileName.reverse();
  progress.reverse();
  return (
    <section className="relative w-60 space-y-4">
      <button
        onClick={() => setIsDropDown(true)}
        className="mt-1 flex w-fit items-center justify-center
      space-x-2 rounded-2xl bg-white px-5 py-4 text-textC
      shadow-md shadow-[#ddd] duration-300 hover:bg-darkC2 hover:shadow-[#bbb]"
      >
        <HiOutlinePlusSm className="h-6 w-6" />
        <span className="text-sm font-medium">New</span>
      </button>
      {/* Add new file or folder drop down */}
      {isDropDown && (
        <DropDown
          setAddNewFolder={setAddNewFolder}
          uploadFile={uploadFile}
          setIsDropDown={setIsDropDown}
        />
      )}
      {/* Progress Indicator */}
      <ProgressIndicator
        progress={progress}
        fileName={fileName}
        setFileName={setFileName}
      />
      {/* New folder */}
      {addNewFolder && <AddFolder setAddNewFolder={setAddNewFolder} />}
      {/* navbar */}
      <Navbar />
    </section>
  );
}

export default SideMenu;
