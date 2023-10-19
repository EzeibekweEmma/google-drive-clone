import { database } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

let files = collection(database, "files");

export const addFiles = (
  fileLink: string,
  fileName: string,
  folderId: string,
) => {
  try {
    addDoc(files, {
      fileLink: fileLink,
      fileName: fileName,
      isFolder: false,
      folderId: folderId,
    });
  } catch (err) {
    console.error(err);
  }
};

export const addFolder = (payload: payloadProps) => {
  try {
    addDoc(files, {
      ...payload,
    });
  } catch (err) {
    console.error(err);
  }
};
