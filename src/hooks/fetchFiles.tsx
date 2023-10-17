import { onSnapshot, collection } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

let files = collection(database, "files");

export const fetchFiles = () => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  useEffect(() => {
    return onSnapshot(files, (res) => {
      return setFileList(
        res.docs.map((doc) => {
          const fileExtension = doc.data().fileName?.split(".").pop();
          return {
            ...doc.data(),
            id: doc.id,
            fileName: doc.data().fileName,
            fileExtension: fileExtension,
            fileLink: doc.data().fileLink,
          };
        }),
      );
    });
  }, []);

  return fileList;
};
