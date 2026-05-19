import { onSnapshot, collection, query, where } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

let files = collection(database, "files");

const matchesOwner = (
  data: Record<string, unknown>,
  userId: string,
  userEmail?: string,
) => {
  return data.userId === userId || (!!userEmail && data.userEmail === userEmail);
};

export const fetchFiles = (
  folderId: string,
  userId: string,
  userEmail?: string,
) => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  const getFolders = () => {
    if (userId) {
      const getUserFiles = query(files, where("userId", "!=", null));
      if (!folderId) {
        onSnapshot(getUserFiles, (res) => {
          return setFileList(
            res.docs
              .map((doc) => {
                const data = doc.data();
                const fileExtension = doc
                  .data()
                  .fileName?.split(".")
                  .pop()
                  ?.toLowerCase();
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
                };
              })
              .filter((file) => matchesOwner(file, userId, userEmail))
              .filter((file) => file.folderId === "") as FileListProps[],
          );
        });
      } else {
        onSnapshot(getUserFiles, (res) => {
          return setFileList(
            res.docs
              .map((doc) => {
                const data = doc.data();
                const fileExtension = doc
                  .data()
                  .fileName?.split(".")
                  .pop()
                  ?.toLowerCase();
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
                };
              })
              .filter((file) => matchesOwner(file, userId, userEmail))
              .filter((file) => file.folderId === folderId) as FileListProps[],
          );
        });
      }
    }
  };

  useEffect(() => {
    getFolders();
  }, [folderId, userEmail, userId]);

  return fileList;
};
