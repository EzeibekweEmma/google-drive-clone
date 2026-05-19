import { onSnapshot, collection } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

interface FileData extends Record<string, unknown> {
  fileName?: string;
  fileLink?: string;
  folderId?: string;
  folderName?: string;
  isFolder?: boolean;
  isStarred?: boolean;
  isTrashed?: boolean;
  fileSize?: number;
  isShared?: boolean;
  shareToken?: string;
  userId?: string;
  userEmail?: string;
}

interface FileListProps extends Record<string, unknown> {
  id?: string;
  fileName?: string;
  fileExtension?: string;
  fileLink?: string;
  folderId?: string;
  folderName?: string;
  isFolder?: boolean;
  isStarred?: boolean;
  isTrashed?: boolean;
  fileSize?: number;
  isShared?: boolean;
  shareToken?: string;
  userId?: string;
  userEmail?: string;
}

const files = collection(database, "files");

const matchesOwner = (
  data: Record<string, unknown>,
  userId: string,
  userEmail?: string | null,
) => {
  return data.userId === userId || (!!userEmail && data.userEmail === userEmail);
};

export const useFetchFiles = (
  folderId: string,
  userId?: string,
  userEmail?: string | null,
) => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  useEffect(() => {
    if (userId) {
      if (!folderId) {
        onSnapshot(files, (res) => {
          return setFileList(
            res.docs
              .map((doc) => {
                const data = doc.data() as FileData;
                const fileExtension = data.fileName?.split(".").pop()?.toLowerCase();
                return {
                  ...data,
                  id: doc.id,
                  fileName: data.fileName,
                  fileExtension: fileExtension,
                  fileLink: data.fileLink,
                  folderId: data.folderId,
                  folderName: data.folderName,
                  isFolder: data.isFolder,
                  isStarred: data.isStarred,
                  isTrashed: data.isTrashed,
                  fileSize: data.fileSize,
                  isShared: data.isShared,
                  shareToken: data.shareToken,
                };
              })
              .filter((file) => matchesOwner(file as Record<string, unknown>, userId, userEmail))
              .filter((file) => file.folderId === ""),
          );
        });
      } else {
        onSnapshot(files, (res) => {
          return setFileList(
            res.docs
              .map((doc) => {
                const data = doc.data() as FileData;
                const fileExtension = data.fileName?.split(".").pop()?.toLowerCase();
                return {
                  ...data,
                  id: doc.id,
                  fileName: data.fileName,
                  fileExtension: fileExtension,
                  fileLink: data.fileLink,
                  folderId: data.folderId,
                  folderName: data.folderName,
                  isFolder: data.isFolder,
                  isStarred: data.isStarred,
                  isTrashed: data.isTrashed,
                  fileSize: data.fileSize,
                  isShared: data.isShared,
                  shareToken: data.shareToken,
                };
              })
              .filter((file) => matchesOwner(file, userId, userEmail))
              .filter((file) => file.folderId === folderId),
          );
        });
      }
    }
  }, [folderId, userEmail, userId]);

  return fileList;
};
