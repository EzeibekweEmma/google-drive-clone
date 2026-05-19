"use client";
import React, { useState, ChangeEvent } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./addBtnComponents/DropDown";
import AddFolder from "./addBtnComponents/AddFolder";
import Navbar from "./Navbar";
import fileUpload from "@/API/FileUpload";
import ProgressIndicator from "./ProgressIndicator";
import {
  addFolder,
  replaceConflictingEntry,
  deleteFile,
  USER_STORAGE_LIMIT_BYTES,
} from "@/API/Firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { fetchAllFiles } from "@/hooks/fetchAllFiles";

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
  const userId = session?.user.id;
  const userEmail = session?.user.email;
  const allFiles = fetchAllFiles(userId!, userEmail ?? undefined);
  const currentUsageBytes = allFiles.reduce((total, entry) => {
    if (entry.isFolder) return total;
    return total + Number(entry.fileSize ?? 0);
  }, 0);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const ensureWithinStorageLimit = (bytesToAdd: number) => {
    if (currentUsageBytes + bytesToAdd > USER_STORAGE_LIMIT_BYTES) {
      window.alert(`You have reached your ${formatBytes(USER_STORAGE_LIMIT_BYTES)} storage limit.`);
      return false;
    }

    return true;
  };

  // Add new file
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;

    const files = e.target.files || [];
    const totalUploadSize = Array.from(files).reduce(
      (total, file) => total + Number(file?.size ?? 0),
      0,
    );

    if (!ensureWithinStorageLimit(totalUploadSize)) {
      e.target.value = "";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files?.[i];
      if (!file) return;

      const conflict = allFiles.find(
        (entry) =>
          !entry.isFolder &&
          entry.folderId === (Folder?.[1] || "") &&
          entry.fileName === file.name,
      );

      if (conflict) {
        const confirmed = window.confirm(
          `"${file.name}" already exists here. Replace it?`,
        );

        if (!confirmed) continue;

        await deleteFile(
          conflict.id,
          false,
          conflict.publicId,
          conflict.resourceType,
        );
      }

      setFileName((prev) => [...prev, file.name]);
      await fileUpload(file, setProgress, Folder?.[1] || "", userId, userEmail ?? "");
    }
    e.target.value = "";
  };
  fileName.reverse();
  progress.reverse();

  // Add new folder
  const uploadFolder = async () => {
    if (!userId) return false;

    const nextFolderName = folderName === "" ? "Untitled folder" : folderName;
    const conflict = allFiles.find(
      (entry) =>
        entry.isFolder &&
        entry.folderId === (Folder?.[1] || "") &&
        entry.folderName === nextFolderName,
    );

    if (conflict) {
      const confirmed = window.confirm(
        `"${nextFolderName}" already exists here. Replace it?`,
      );

      if (!confirmed) return false;

      await replaceConflictingEntry(conflict);
    }

    let payload = {
      folderName: nextFolderName,
      isFolder: true,
      isStarred: false,
      isTrashed: false,
      FileList: [],
      folderId: Folder?.[1] || "",
      userId,
      userEmail: userEmail ?? "",
    };

    await addFolder(payload);
    setFolderName("");
    return true;
  };

  const uploadFolderFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalUploadSize = files.reduce(
      (total, file) => total + Number(file?.size ?? 0),
      0,
    );

    if (!ensureWithinStorageLimit(totalUploadSize)) {
      e.target.value = "";
      return;
    }

    const currentFolderId = Folder?.[1] || "";
    const folderDocsById = new Map(
      allFiles.filter((entry) => entry.isFolder).map((entry) => [entry.id, entry]),
    );
    const folderPathMap = new Map<string, string>();

    const buildFolderPath = (folderId: string) => {
      if (!folderId) return "";

      const labels: string[] = [];
      let pointer = folderDocsById.get(folderId);

      while (pointer) {
        labels.unshift(pointer.folderName);
        if (!pointer.folderId) break;
        pointer = folderDocsById.get(pointer.folderId);
      }

      return labels.join("/");
    };

    folderDocsById.forEach((entry, id) => {
      folderPathMap.set(buildFolderPath(id), id);
    });

    const ensureFolderPath = async (relativeFolderPath: string) => {
      if (!relativeFolderPath) return currentFolderId;

      const basePath = currentFolderId ? buildFolderPath(currentFolderId) : "";
      const segments = relativeFolderPath.split("/").filter(Boolean);
      let parentId = currentFolderId;
      let pathKey = basePath;

      for (const segment of segments) {
        pathKey = pathKey ? `${pathKey}/${segment}` : segment;

        if (folderPathMap.has(pathKey)) {
          parentId = folderPathMap.get(pathKey)!;
          continue;
        }

        const existing = allFiles.find(
          (entry) =>
            entry.isFolder &&
            entry.folderId === parentId &&
            entry.folderName === segment,
        );

        if (existing) {
          folderPathMap.set(pathKey, existing.id);
          folderDocsById.set(existing.id, existing);
          parentId = existing.id;
          continue;
        }

        const createdFolder = await addFolder({
          folderName: segment,
          isFolder: true,
          FileList: [],
          isStarred: false,
          isTrashed: false,
          folderId: parentId,
          userId,
          userEmail: userEmail ?? "",
        });

        if (!createdFolder) {
          throw new Error("Unable to create folder structure.");
        }

        const createdEntry = {
          id: createdFolder.id,
          folderName: segment,
          isFolder: true,
          fileLink: "",
          fileName: "",
          isStarred: false,
          isTrashed: false,
          fileExtension: "",
          folderId: parentId,
          userId,
          userEmail,
        } as FileListProps;

        folderPathMap.set(pathKey, createdFolder.id);
        folderDocsById.set(createdFolder.id, createdEntry);
        parentId = createdFolder.id;
      }

      return parentId;
    };

    for (const file of files) {
      const relativePath = file.webkitRelativePath || file.name;
      const parts = relativePath.split("/");
      const uploadName = parts.pop() || file.name;
      const relativeFolderPath = parts.join("/");
      const parentId = await ensureFolderPath(relativeFolderPath);

      const conflict = allFiles.find(
        (entry) =>
          !entry.isFolder &&
          entry.folderId === parentId &&
          entry.fileName === uploadName,
      );

      if (conflict) {
        const confirmed = window.confirm(
          `"${uploadName}" already exists here. Replace it?`,
        );

        if (!confirmed) continue;

        await deleteFile(
          conflict.id,
          false,
          conflict.publicId,
          conflict.resourceType,
        );
      }

      setFileName((prev) => [...prev, uploadName]);
      await fileUpload(
        file,
        setProgress,
        parentId,
        userId,
        userEmail ?? "",
        uploadName,
      );
    }

    e.target.value = "";
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
          uploadFolderFiles={uploadFolderFiles}
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
      <div className="absolute bottom-4 left-0 w-full pr-4">
        <div className="rounded-2xl bg-white/90 px-2 tablet:px-4 py-3 text-sm text-textC shadow-sm shadow-[#ddd]">
          <div className="mb-2 flex items-center justify-between font-medium">
            <span className="hidden tablet:block">Storage</span>
            <span>
              {formatBytes(currentUsageBytes)} / {formatBytes(USER_STORAGE_LIMIT_BYTES)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-darkC2 hidden tablet:block">
            <div
              className={`h-full rounded-full ${ currentUsageBytes >= (USER_STORAGE_LIMIT_BYTES / 1.25 ) ? "bg-red-500" : "bg-[#1a73e8]"}`}
              style={{
                width: `${Math.min(
                  100,
                  (currentUsageBytes / USER_STORAGE_LIMIT_BYTES) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SideMenu;
