import { database } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

let files = collection(database, "files");

const addFiles = (imageLink: string) => {
  try {
    addDoc(files, { imageLink: imageLink });
  } catch (err) {
    console.error(err);
  }
};

export default addFiles;
