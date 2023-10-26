"use client";
import React, { useState, ChangeEvent } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./addBtnComponents/DropDown";
import AddFolder from "./addBtnComponents/AddFolder";
import Navbar from "./Navbar";
import fileUpload from "@/API/FileUpload";
import ProgressIndicator from "./ProgressIndicator";
import { addFolder } from "@/API/Firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function SideMenu() {
  const [isDropDown, setIsDropDown] = useState(false);
  // TODO: change uploadStatus to progress
  // const [uploadStatus, setUploadStatus] = useState([]);
  const [progress, setProgress] = useState([]);
  const [fileName, setFileName] = useState<string[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [folderToggle, setFolderToggle] = useState(false);

  const router = useRouter();
  const { Folder } = router.query;

  const { data: session } = useSession();
  const userEmail = session?.user.email;

  // Add new file
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    for (let i = 0; i < files.length; i++) {
      const file = files?.[i];
      if (!file) return;
      setFileName((prev) => [...prev, file.name]);
      fileUpload(file, setProgress, Folder?.[1] || "", userEmail!);
    }
  };
  fileName.reverse();
  progress.reverse();

  // Add new folder
  const uploadFolder = () => {
    let payload = {
      folderName: folderName === "" ? "Untitled folder" : folderName,
      isFolder: true,
      isStarred: false,
      isTrashed: false,
      FileList: [],
      folderId: Folder?.[1] || "",
      userEmail,
    };

    addFolder(payload);
    setFolderName("");
  };

  return (
    <section className="relative h-[90vh] w-16 space-y-4 duration-500 tablet:w-60">
      <button
        onClick={() => setIsDropDown(true)}
        className="mt-1 flex w-fit items-center justify-center space-x-2
      rounded-2xl bg-white p-3 text-textC shadow-md shadow-[#ddd]
      duration-300 hover:bg-darkC2 hover:shadow-[#bbb] tablet:px-5 tablet:py-4"
      >
        <HiOutlinePlusSm className="h-6 w-6" />
        <span className="hidden text-sm font-medium tablet:block">New</span>
      </button>
      {/* Add new file or folder drop down */}
      {isDropDown && (
        <DropDown
          setFolderToggle={setFolderToggle}
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
      {folderToggle && (
        <AddFolder
          setFolderToggle={setFolderToggle}
          setFolderName={setFolderName}
          uploadFolder={uploadFolder}
        />
      )}
      {/* navbar */}
      <Navbar />
    </section>
  );
}

export default SideMenu;
