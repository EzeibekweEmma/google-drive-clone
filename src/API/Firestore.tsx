import { database } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

let files = collection(database, "files");

const addFiles = (fileLink: string, fileName: string) => {
  try {
    addDoc(files, { fileLink: fileLink, fileName: fileName });
  } catch (err) {
    console.error(err);
  }
};

export default addFiles;
