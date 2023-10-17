import { database } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

let files = collection(database, "files");

export const addFiles = (fileLink: string, fileName: string) => {
  try {
    addDoc(files, { fileLink: fileLink, fileName: fileName, isFolder: false });
  } catch (err) {
    console.error(err);
  }
};

export const addFolder = (payload: payloadProps) => {
  try {
    const { folderName, isFolder, FileList } = payload;
    addDoc(files, {
      folderName,
      isFolder,
      FileList,
    });
  } catch (err) {
    console.error(err);
  }
};
