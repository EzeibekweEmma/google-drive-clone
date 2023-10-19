import { onSnapshot, collection } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

let files = collection(database, "files");

export const fetchFiles = (folderId: string) => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  const getFolders = () => {
    if (!folderId) {
      onSnapshot(files, (res) => {
        return setFileList(
          res.docs
            .map((doc) => {
              const fileExtension = doc.data().fileName?.split(".").pop();
              return {
                ...doc.data(),
                id: doc.id,
                fileName: doc.data().fileName,
                fileExtension: fileExtension,
                fileLink: doc.data().fileLink,
                folderId: doc.data().folderId,
              };
            })
            .filter((file) => file.folderId === "") as FileListProps[],
        );
      });
    } else {
      onSnapshot(files, (res) => {
        return setFileList(
          res.docs
            .map((doc) => {
              const fileExtension = doc.data().fileName?.split(".").pop();
              return {
                ...doc.data(),
                id: doc.id,
                fileName: doc.data().fileName,
                fileExtension: fileExtension,
                fileLink: doc.data().fileLink,
                folderId: doc.data().folderId,
              };
            })
            .filter((file) => file.folderId === folderId) as FileListProps[],
        );
      });
    }
  };

  useEffect(() => {
    getFolders();
  }, [folderId]);

  return fileList;
};
