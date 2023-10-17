import { onSnapshot, collection } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

let files = collection(database, "files");

export const fetchFiles = () => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  const getFileName = (url: string) => {
    // Split the URL by '/'
    const urlParts = url.split("/");

    // Get the last part, which should be the encoded file name
    const encodedFileNameWithQuery = urlParts[urlParts.length - 1];

    // Split the encoded file name by '?'
    const encodedFileNameParts = encodedFileNameWithQuery.split("?");

    // Get the first part, which is the encoded file name
    const encodedFileName = encodedFileNameParts[0];

    // Decode the URL-encoded file name to get the actual file name
    const decodedFileName = decodeURIComponent(encodedFileName);
    const fileName = decodedFileName.split("/")[1];
    const fileExtension = fileName?.split(".").pop();
    return [fileName, fileExtension];
  };

  useEffect(() => {
    return onSnapshot(files, (res) => {
      setFileList(
        res.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
            fileName: getFileName(doc.data().imageLink)[0],
            fileExtension: getFileName(doc.data().imageLink)[1],
          };
        }),
      );
    });
  }, []);

  return fileList;
};
